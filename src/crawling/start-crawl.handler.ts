import "reflect-metadata";

import { APIGatewayProxyEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";

import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StartCrawlHandler {
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<string> {
    await new UrlsProcessor(this.getUrl()).process();
    return "started";
  }

  private getUrl(): CrawlUrl {
    if (this.event.body) {
      const { url } = JSON.parse(this.event.body);
      return plainToClass(CrawlUrl, { url });
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
