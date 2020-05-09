import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { plainToClass } from "class-transformer";

import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StartCrawlHandler {
  constructor(private event: APIGatewayProxyEvent, private context?: Context) {}

  public async handle(): Promise<APIGatewayProxyResult> {
    await new UrlsProcessor(this.getUrl()).process();
    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: { "Content-Type": "application/json" },
      body: "started",
    };
  }

  private getUrl(): CrawlUrl {
    if (this.event.body) {
      const { url } = JSON.parse(this.event.body);
      return plainToClass(CrawlUrl, { url });
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
