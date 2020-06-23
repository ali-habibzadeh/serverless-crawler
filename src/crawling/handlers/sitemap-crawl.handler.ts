import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { plainToClass } from "class-transformer";
import { SitemaplUrl } from "../models/sitemap-url.model";
import { SitemapService } from "../sitemap.service";

export class SitemapCrawlHandler {
  private converter = DynamoDB.Converter;

  constructor(private event: DynamoDBStreamEvent) {}

  public async handle(): Promise<string> {
    const inserts = this.event.Records.filter(record => record.eventName === "INSERT");
    await Promise.all(inserts.map(async record => this.processSitemapUrl(record)));
    return `done.`;
  }

  private async processSitemapUrl(record: DynamoDBRecord): Promise<void> {
    const url = this.getUrl(record);
    await new SitemapService(url).crawl();
  }

  private getUrl(record: DynamoDBRecord): SitemaplUrl {
    const { NewImage } = record.dynamodb!;
    if (NewImage) {
      const unmarshalled = this.converter.unmarshall(NewImage);
      return plainToClass(SitemaplUrl, unmarshalled);
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}
