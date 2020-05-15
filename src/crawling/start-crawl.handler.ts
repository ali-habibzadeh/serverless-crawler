import "reflect-metadata";

import { APIGatewayProxyEvent } from "aws-lambda";

import { crawlUrlStore } from "./url-processing/crawl-url.model";

export class StartCrawlHandler {
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<string> {
    await crawlUrlStore.put({ url: this.getUrl(), level: 0 }).exec();
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
