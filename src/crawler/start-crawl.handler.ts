import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

import { DynamodbService } from "../core/dynamodb/dynamodb.service";

export class StartCrawlHandler {
  constructor(protected event: DynamoDBStreamEvent) {}

  public async handle(): Promise<string> {
    await Promise.all(this.event.Records.map(async (record) => this.processUrl(record)));
    return "done.";
  }

  // tslint:disable-next-line: no-feature-envy
  private async processUrl(record: DynamoDBRecord): Promise<void> {
    const ni = record.dynamodb!.NewImage;
    if (ni) {
      console.log(DynamodbService.Converter.unmarshall(ni));
    }
  }
}
