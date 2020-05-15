import { attribute, TransactPut, TransactWriteRequest } from "@shiftcoders/dynamo-easy";

import { DynamodbService } from "../../core/dynamodb/dynamodb.service";
import { DataDeliveryService } from "../../data-delivery/data-delivery.service";
import { MetricNames } from "../../metrics/metrics-list";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl } from "./crawl-url.model";

export class UrlsProcessor {
  private dynamodb = DynamodbService.getInstance();
  constructor(private crawlUrl: CrawlUrl) {}

  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    await new DataDeliveryService(metrics).deliver();
    return this.crawlNextBatch(metrics[MetricNames.InternalLinks]);
  }

  private async crawlNextBatch(links: string[]): Promise<void> {
    const level = this.crawlUrl.level + 1;
    const transactions = links.map((url) =>
      new TransactPut(CrawlUrl, { url, level }).onlyIf(attribute("url").attributeNotExists())
    );
    await new TransactWriteRequest(this.dynamodb).transact(...transactions).exec();
  }
}
