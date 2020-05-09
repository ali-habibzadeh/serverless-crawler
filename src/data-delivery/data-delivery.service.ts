import { PutRecordOutput } from "aws-sdk/clients/firehose";

import { appConfig } from "../config/config.service";
import { FirehoseService } from "../core/firehose/firehose.service";
import { MetricNames } from "../metrics/metrics-list";

export class DataDeliveryService {
  private firehose = FirehoseService.getInstance();
  constructor(private metrics: Record<MetricNames, any>) {}

  public async deliver(): Promise<PutRecordOutput> {
    return this.writeToS3(this.metrics);
  }

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
