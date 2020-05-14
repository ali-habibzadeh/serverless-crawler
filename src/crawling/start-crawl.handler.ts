import "reflect-metadata";

import { APIGatewayProxyEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";

import { BrowserService } from "../page-rendering/config/browser.service";
import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StartCrawlHandler {
  private bs = BrowserService;
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<string> {
    await this.bs.createBrowser();
    await new UrlsProcessor(this.getUrl()).process();
    await this.bs.close();
    return "started";
  }

  private getUrl(): CrawlUrl {
    if (this.event.body) {
      const { url } = JSON.parse(this.event.body);
      return plainToClass(CrawlUrl, { url, level: 0 });
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
