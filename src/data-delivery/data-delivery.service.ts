import Firehose, { PutRecordOutput } from "aws-sdk/clients/firehose";

import { appConfig } from "../config/config.service";
import { MetricNames } from "../metrics/metrics-list";
import { CatchAll } from "../utils/catch-all";

export class DataDeliveryService {
  private firehose = new Firehose();
  constructor(private metrics: Record<MetricNames, any>) {}

  public async deliver(): Promise<PutRecordOutput> {
    if (this.metrics) {
      return this.writeToS3(this.metrics);
    }
    throw new Error("Metrics can not be empty for s3 delivery");
  }

  @CatchAll
  private async writeToS3(data: Record<MetricNames, any>): Promise<PutRecordOutput> {
    const input = {
      DeliveryStreamName: appConfig.crawlDataDeliveryStreamName,
      Record: {
        Data: JSON.stringify(data),
      },
    };
    return this.firehose.putRecord(input).promise();
  }
}
