import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { plainToClass } from "class-transformer";

import { BrowserService } from "../../page-rendering/config/browser.service";
import { CrawlUrl } from "../crawl-url.model";
import { CrawlingService } from "../crawling.service";

export class StreamProcessorHandler {
  private converter = DynamoDB.Converter;

  constructor(private event: DynamoDBStreamEvent) {}

  public async handle(): Promise<string> {
    await BrowserService.createBrowser();
    const inserts = this.event.Records.filter(record => record.eventName === "INSERT");
    await Promise.all(inserts.map(async record => this.processUrl(record)));
    // -/ await BrowserService.close();
    return `done.`;
  }

  private async processUrl(record: DynamoDBRecord): Promise<void> {
    const url = this.getUrl(record);
    await new CrawlingService(url).crawl();
  }

  private getUrl(record: DynamoDBRecord): CrawlUrl {
    const { NewImage } = record.dynamodb!;
    if (NewImage) {
      const unmarshalled = this.converter.unmarshall(NewImage);
      return plainToClass(CrawlUrl, unmarshalled);
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}
