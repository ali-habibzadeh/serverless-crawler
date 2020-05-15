import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { plainToClass } from "class-transformer";

import { BrowserService } from "../page-rendering/config/browser.service";
import { CatchAll } from "../utils/catch-all";
import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StreamProcessorHandler {
  private converter = DynamoDB.Converter;

  constructor(private event: DynamoDBStreamEvent) {}

  @CatchAll
  public async handle(): Promise<string> {
    await BrowserService.createBrowser();
    const inserts = this.event.Records.filter((record) => record.eventName === "INSERT");
    await Promise.all(inserts.map(async (record) => this.processUrl(record)));
    await BrowserService.close();
    return `done.`;
  }

  @CatchAll
  private async processUrl(record: DynamoDBRecord): Promise<void> {
    const url = this.getUrl(record);
    await new UrlsProcessor(url).process();
  }

  private getUrl(record: DynamoDBRecord): CrawlUrl {
    const { NewImage } = record.dynamodb!;
    if (NewImage) {
      const unmarshalled = <CrawlUrl>this.converter.unmarshall(NewImage);
      return plainToClass(CrawlUrl, unmarshalled);
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}
