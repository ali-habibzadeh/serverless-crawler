import "reflect-metadata";

import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";

import { DynamodbService } from "../core/dynamodb/dynamodb.service";
import { CatchAll } from "../core/utils/catch-all";
import { BrowserService } from "../page-rendering/config/browser.service";
import { CrawlUrl } from "./url-processing/crawl-url.model";
import { UrlsProcessor } from "./url-processing/url-processor";

export class StreamProcessorHandler {
  constructor(private event: DynamoDBStreamEvent) {}

  // tslint:disable-next-line: no-feature-envy
  @CatchAll
  public async handle(): Promise<string> {
    await BrowserService.createBrowser();
    const inserts = this.event.Records.filter((record) => record.eventName === "INSERT");
    await Promise.all(inserts.map(async (record) => new UrlsProcessor(record).process()));
    await BrowserService.close();
    return `done.`;
  }
}
