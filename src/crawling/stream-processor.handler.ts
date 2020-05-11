import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

import { DynamodbService } from "../core/dynamodb/dynamodb.service";
import { BrowserService } from "../page-rendering/config/browser.service";
import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StreamProcessorHandler {
  private converter = DynamodbService.Converter;

  constructor(private event: DynamoDBStreamEvent) {}

  public async handle(): Promise<string> {
    await BrowserService.createBrowser();
    const inserts = this.event.Records.filter((record) => record.eventName === "INSERT");
    await Promise.all(inserts.map(async (record) => this.processUrl(record)));
    await BrowserService.close();
    return "done.";
  }

  private async processUrl(record: DynamoDBRecord): Promise<void> {
    const url = this.getUrl(record);
    await new UrlsProcessor(url).process();
  }

  private getUrl(record: DynamoDBRecord): CrawlUrl {
    const { NewImage } = record.dynamodb!;
    if (NewImage) {
      return <CrawlUrl>this.converter.unmarshall(NewImage);
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}
