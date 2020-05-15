import "reflect-metadata";

import { APIGatewayProxyEvent } from "aws-lambda";

import { BrowserService } from "../page-rendering/config/browser.service";
import { crawlUrlStore } from "./url-processing/crawl-url.model";

export class StartCrawlHandler {
  private bs = BrowserService;
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<string> {
    await crawlUrlStore.put({ url: this.getUrl(), level: 0 }).ifNotExists().exec();
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
