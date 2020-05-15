import { DataDeliveryService } from "../../data-delivery/data-delivery.service";
import { MetricNames } from "../../metrics/metrics-list";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl, crawlUrlStore } from "./crawl-url.model";

export class UrlsProcessor {
  constructor(private crawlUrl: CrawlUrl) {}

  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    await new DataDeliveryService(metrics).deliver();
    return this.crawlNextBatch(metrics[MetricNames.InternalLinks]);
  }

  private async crawlNextBatch(links: string[]): Promise<void> {
    const transactions = links.map(async (url) => {
      await crawlUrlStore
        .put({ url, level: this.crawlUrl.level + 1 })
        .ifNotExists()
        .exec();
    });
    await Promise.all(transactions);
  }
}
