import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";

import { DynamodbService } from "../core/dynamodb/dynamodb.service";
import { CatchAll } from "../core/utils/catch-all";
import { BrowserService } from "../page-rendering/config/browser.service";
import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StreamProcessorHandler {
  private converter = DynamodbService.Converter;

  constructor(private event: DynamoDBStreamEvent) {}

  // tslint:disable-next-line: no-feature-envy
  @CatchAll
  public async handle(): Promise<string> {
    await BrowserService.createBrowser();
    // ... const inserts = this.event.Records.filter((record) => record.eventName === "INSERT");
    // ... await Promise.all(inserts.map(async (record) => this.processUrl(record)));
    const isConnected = BrowserService.getBrowser().isConnected;
    await BrowserService.close();
    return `Browser was connected?: ${isConnected}`;
  }

  @CatchAll
  private async processUrl(record: DynamoDBRecord): Promise<void> {
    const url = this.getUrl(record);
    await new UrlsProcessor(url).process();
  }

  private getUrl(record: DynamoDBRecord): CrawlUrl {
    const { NewImage } = record.dynamodb!;
    if (NewImage) {
      const { url } = <CrawlUrl>this.converter.unmarshall(NewImage);
      return plainToClass(CrawlUrl, { url });
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}
