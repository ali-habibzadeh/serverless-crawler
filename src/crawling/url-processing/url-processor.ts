import { DynamoDBRecord } from "aws-lambda";
import { plainToClass } from "class-transformer";

import { DynamodbService } from "../../core/dynamodb/dynamodb.service";
import { DataDeliveryService } from "../../data-delivery/data-delivery.service";
import { MetricNames } from "../../metrics/metrics-list";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl } from "./crawl-url.model";

export class UrlsProcessor {
  private dynamodb = DynamodbService.getInstance();
  private converter = DynamodbService.Converter;
  private alreadyModified = this.record.dynamodb?.OldImage !== undefined;
  private crawlUrl = this.getUrl();

  constructor(private record: DynamoDBRecord) {}

  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    await new DataDeliveryService(metrics).deliver();
    return this.crawlNextBatch(metrics[MetricNames.InternalLinks]);
  }

  private async crawlNextBatch(links: string[]): Promise<void> {
    const level = this.crawlUrl.level + 1;
    const toSave = links.map((url) =>
      plainToClass(CrawlUrl, { url, ...(!this.alreadyModified && { level }) })
    );
    const writer = this.dynamodb.batchPut(toSave);
    for await (const persisted of writer) {
      console.log(`Successfully wrote ${persisted.url}`);
    }
  }

  private getUrl(): CrawlUrl {
    const { NewImage, OldImage } = this.record.dynamodb!;
    const image = OldImage || NewImage;
    if (image) {
      const unmarshalled = <CrawlUrl>this.converter.unmarshall(image);
      return plainToClass(CrawlUrl, unmarshalled);
    }
    throw new Error(`Invalid DynamoDBRecord ${this.record}`);
  }
}
