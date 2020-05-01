import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

import { DynamodbService } from "../core/dynamodb/dynamodb.service";
import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StartCrawlHandler {
  private inserts = this.event.Records.filter((record) => record.eventName === "INSERT");
  private converter = DynamodbService.Converter;

  constructor(protected event: DynamoDBStreamEvent) {}

  public async handle(): Promise<string> {
    await Promise.all(this.inserts.map(async (record) => this.processUrl(record)));
    return "done.";
  }

  private async processUrl(record: DynamoDBRecord): Promise<void> {
    const url = this.getUrl(record);
    const processor = new UrlsProcessor(url);
    await processor.process();
  }

  private getUrl(record: DynamoDBRecord): CrawlUrl {
    const { NewImage } = record.dynamodb!;
    if (NewImage) {
      return <CrawlUrl>this.converter.unmarshall(NewImage);
    }
    throw new Error(`Invalid DynamoDBRecord ${record}`);
  }
}

new StartCrawlHandler({
  Records: [
    {
      eventID: "3bb72ca0e31954a9cc1861708fafeae3",
      eventName: "INSERT",
      eventVersion: "1.1",
      eventSource: "aws:dynamodb",
      awsRegion: "us-east-1",
      dynamodb: {
        ApproximateCreationDateTime: 1549574393,
        Keys: {
          url: {
            S: "https://www.deepcrawl.com",
          },
        },
        NewImage: {
          url: {
            S: "https://www.deepcrawl.com",
          },
        },
        SequenceNumber: "4191400000000051185472644",
        SizeBytes: 48,
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
      eventSourceARN: "arn:aws:dynamodb:ADD_YOUR_STREAM_ARN_HERE",
    },
  ],
})
  .handle()
  .catch();
