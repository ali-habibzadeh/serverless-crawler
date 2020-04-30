import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

import { DynamodbService } from "../core/dynamodb/dynamodb.service";
import { CrawlUrl } from "./url-processing/crawl-url.model";

export class StartCrawlHandler {
  private inserts = this.event.Records.filter((record) => record.eventName === "INSERT");
  private converter = DynamodbService.Converter;

  constructor(protected event: DynamoDBStreamEvent) {}

  public async handle(): Promise<string> {
    await Promise.all(this.inserts.map(async (record) => this.processUrl(record)));
    return "done.";
  }

  private async processUrl(record: DynamoDBRecord): Promise<any> {
    const url = this.getUrl(record);
    console.log("model extracted", url);
  }

  private getUrl(record: DynamoDBRecord): CrawlUrl {
    const { NewImage } = record.dynamodb!;
    if (NewImage) {
      return <CrawlUrl>this.converter.unmarshall(NewImage);
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}
