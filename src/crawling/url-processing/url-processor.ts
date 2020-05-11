import { plainToClass } from "class-transformer";

import { DynamodbService } from "../../core/dynamodb/dynamodb.service";
import { CatchAll } from "../../core/utils/catch-all";
import { DataDeliveryService } from "../../data-delivery/data-delivery.service";
import { MetricNames } from "../../metrics/metrics-list";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl } from "./crawl-url.model";

export class UrlsProcessor {
  private dynamodb = DynamodbService.getInstance();
  constructor(private crawlUrl: CrawlUrl) {}

  @CatchAll
  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    await new DataDeliveryService(metrics).deliver();
    return this.crawlNextBatch(metrics[MetricNames.InternalLinks]);
  }

  @CatchAll
  private async crawlNextBatch(links: string[]): Promise<void> {
    const toSave = links.map((url) => plainToClass(CrawlUrl, { url }));
    const writer = this.dynamodb.batchPut(toSave);
    for await (const persisted of writer) {
      console.log(`Successfully wrote ${persisted.url}`);
    }
  }
}
