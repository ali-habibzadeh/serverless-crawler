import Firehose, {
  PutRecordOutput,
  UpdateDestinationOutput,
  ExtendedS3DestinationUpdate
} from "aws-sdk/clients/firehose";

import { appConfig } from "../config/config.service";
import { MetricNames } from "../metrics/metrics-list";

export class DataDeliveryService {
  private firehose = new Firehose();
  private streamName = appConfig.crawlDataDeliveryStreamName;

  public async deliver(metrics: Record<MetricNames, any>): Promise<PutRecordOutput> {
    if (metrics) {
      return this.writeToS3(metrics);
    }
    throw new Error("Metrics can not be empty for s3 delivery");
  }

  private async writeToS3(data: Record<MetricNames, any>): Promise<PutRecordOutput> {
    const input = {
      DeliveryStreamName: this.streamName,
      Record: { Data: JSON.stringify(data) }
    };
    return this.firehose.putRecord(input).promise();
  }

  public async updateDestination(update: ExtendedS3DestinationUpdate): Promise<UpdateDestinationOutput> {
    const desc = await this.firehose.describeDeliveryStream({ DeliveryStreamName: this.streamName }).promise();
    return this.firehose
      .updateDestination({
        DeliveryStreamName: this.streamName,
        CurrentDeliveryStreamVersionId: desc.DeliveryStreamDescription.VersionId,
        DestinationId: desc.DeliveryStreamDescription.Destinations[0].DestinationId,
        ExtendedS3DestinationUpdate: { ...update }
      })
      .promise();
  }
}
