import { APIGatewayProxyEvent } from "aws-lambda";

import { crawlUrlStore } from "../models/crawl-url.model";
import { DataDeliveryService } from "../../data-delivery/data-delivery.service";
import { sitemapUrlStore } from "../models/sitemap-url.model";

export class StartCrawlHandler {
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<string> {
    const { host, href, protocol } = new URL(this.getUrl());
    await new DataDeliveryService().updateDestination({ Prefix: `crawl-data/${host}/` });
    await crawlUrlStore.put({ url: href, level: 0 }).exec();
    await sitemapUrlStore.put({ url: `${protocol}//${host}/sitemap.xml` }).exec();
    return "started";
  }

  private getUrl(): string {
    if (this.event.body) {
      const { url } = JSON.parse(this.event.body);
      return url;
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
