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
    replicationRegions: ["us-east-2"],
    stream: StreamViewType.NEW_AND_OLD_IMAGES,
  });

  public eventSource = new DynamoEventSource(this.table, {
    startingPosition: StartingPosition.LATEST,
    maxBatchingWindow: Duration.seconds(2),
    parallelizationFactor: 2,
    retryAttempts: 4,
    batchSize: 30,
  });
}
