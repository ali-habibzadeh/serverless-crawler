import Firehose, {
  PutRecordOutput,
  UpdateDestinationOutput,
  ExtendedS3DestinationUpdate
} from "aws-sdk/clients/firehose";

import { appConfig } from "../config/config.service";
import { MetricNames } from "../metrics/metrics-list";

export class DataDeliveryService {
  private firehose = new Firehose();
  private streamName = { DeliveryStreamName: appConfig.crawlDataDeliveryStreamName };

  public async deliver(metrics: Record<MetricNames, any>): Promise<PutRecordOutput> {
    if (!metrics) {
      throw new Error("Metrics can not be empty for s3 delivery");
    }
    const record = { Record: { Data: JSON.stringify(metrics) } };
    return this.firehose.putRecord({ ...this.streamName, ...record }).promise();
  }

  public async updateDestination(update: ExtendedS3DestinationUpdate): Promise<UpdateDestinationOutput> {
    const desc = await this.firehose.describeDeliveryStream({ ...this.streamName }).promise();
    return this.firehose
      .updateDestination({
        ...this.streamName,
        CurrentDeliveryStreamVersionId: desc.DeliveryStreamDescription.VersionId,
        DestinationId: desc.DeliveryStreamDescription.Destinations[0].DestinationId,
        ExtendedS3DestinationUpdate: { ...update }
      })
      .promise();
  }
}
