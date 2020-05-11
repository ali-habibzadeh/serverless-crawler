import { AttributeType, StreamViewType, Table } from "@aws-cdk/aws-dynamodb";
import { StartingPosition } from "@aws-cdk/aws-lambda";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { Construct, Duration } from "@aws-cdk/core";

export class CrawlUrlsTable extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
  }

  public table = new Table(this, "crawlUrlsTable", {
    partitionKey: { name: "url", type: AttributeType.STRING },
    stream: StreamViewType.NEW_IMAGE,
  });

  public eventSource = new DynamoEventSource(this.table, {
    startingPosition: StartingPosition.TRIM_HORIZON,
    maxBatchingWindow: Duration.seconds(2),
    parallelizationFactor: 1,
    retryAttempts: 10,
    batchSize: 30,
    bisectBatchOnError: true,
  });
}
