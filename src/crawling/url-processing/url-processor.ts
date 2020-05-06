import { DynamodbService } from "../../core/dynamodb/dynamodb.service";
import { DataDeliveryService } from "../../data-delivery/data-delivery.service";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl } from "./crawl-url.model";

export class UrlsProcessor {
  private dynamodb = DynamodbService.getInstance();
  constructor(private crawlUrl: CrawlUrl) {}

  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    await new DataDeliveryService(metrics).deliver();
    await this.crawlNextBatch(metrics);
  }

  private async crawlNextBatch(metrics: Record<string, any>): Promise<void> {
    const internalLinksMetric: string[] = metrics["internal_links"];
    const toSave = internalLinksMetric?.map((href) => Object.assign(new CrawlUrl(), { url: href }));
    const writer = this.dynamodb.batchPut(toSave);
    for await (const persisted of writer) {
      console.log(`Successfully wrote ${persisted.url}`);
    }
  }
}
