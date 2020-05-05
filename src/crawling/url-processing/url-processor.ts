import { PutRecordOutput } from "aws-sdk/clients/firehose";

import { appConfig } from "../../config/config.service";
import { DynamodbService } from "../../core/dynamodb/dynamodb.service";
import { FirehoseService } from "../../core/firehose/firehose.service";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl } from "./crawl-url.model";

export class UrlsProcessor {
  private fh = FirehoseService.getInstance();
  constructor(private crawlUrl: CrawlUrl) {}

  // tslint:disable-next-line: no-big-function
  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();

    await this.writeToS3({
      url: this.crawlUrl.url,
      status: metrics.find((metric) => metric.name === "responseStatus")?.value,
    });

    const allLinks: string[] = metrics.find((metric) => metric.name === "internalLinks")?.value;
    // tslint:disable-next-line: ban
    const toSave: CrawlUrl[] = allLinks?.map((href) => Object.assign(new CrawlUrl(), { url: href }));
    const writer = DynamodbService.getInstance().batchPut(toSave);
    for await (const persisted of writer) {
      console.log(`Successfully wrote ${persisted.url}`);
    }
  }

  private async writeToS3(data: any): Promise<PutRecordOutput> {
    return this.fh
      .putRecord({
        DeliveryStreamName: appConfig.crawlDataDeliveryStreamName,
        Record: {
          Data: JSON.stringify(data),
        },
      })
      .promise();
  }
}
