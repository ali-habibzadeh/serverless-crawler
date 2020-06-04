import { attribute, or } from "@shiftcoders/dynamo-easy";

import { DataDeliveryService } from "../../data-delivery/data-delivery.service";
import { MetricNames } from "../../metrics/metrics-list";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl, crawlUrlStore } from "./crawl-url.model";
import { UrlsQualifierService } from "./url-qualifiers/qualifiers.service";

export class UrlsProcessor {
  constructor(private crawlUrl: CrawlUrl) {}

  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    await new DataDeliveryService(metrics).deliver();
    return this.crawlNextBatch(metrics[MetricNames.InternalLinks]);
  }

  private async crawlNextBatch(links: string[]): Promise<void> {
    const hrefs = await new UrlsQualifierService(links).getQualifiedUrls();
    const transactions = hrefs.map(async url => {
      const level = this.crawlUrl.level + 1;
      await crawlUrlStore
        .put({ url, level })
        .onlyIf(or(attribute("level").attributeNotExists(), attribute("level").gte(level)))
        .exec();
    });
    await Promise.allSettled(transactions);
  }
}
