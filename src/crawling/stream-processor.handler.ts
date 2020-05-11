import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

import { DynamodbService } from "../core/dynamodb/dynamodb.service";
import { BrowserService } from "../page-rendering/config/browser.service";
import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StreamProcessorHandler {
  private converter = DynamodbService.Converter;

  constructor(private event: DynamoDBStreamEvent) {}

  // tslint:disable-next-line: no-feature-envy
  public async handle(): Promise<string> {
    await BrowserService.createBrowser();
    console.log("create browser");
    const inserts = this.event.Records.filter((record) => record.eventName === "INSERT");
    console.log("read inserts");
    await Promise.all(inserts.map(async (record) => this.processUrl(record)));
    console.log("process all records");
    await BrowserService.close();
    console.log("closed browser");
    return "done.";
  }

  private async processUrl(record: DynamoDBRecord): Promise<void> {
    const url = this.getUrl(record);
    await new UrlsProcessor(url).process();
  }

  private getUrl(record: DynamoDBRecord): string {
    const { NewImage, OldImage } = record.dynamodb!;
    const image = NewImage || OldImage;
    if (image) {
      const { url } = <CrawlUrl>this.converter.unmarshall(image);
      return url;
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}
