import { AttributeType, StreamViewType, Table, BillingMode } from "@aws-cdk/aws-dynamodb";
import { StartingPosition } from "@aws-cdk/aws-lambda";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { Construct, Duration } from "@aws-cdk/core";
import { IGrantable } from "@aws-cdk/aws-iam";

export class CrawlUrlsTable extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
  }

  public table = new Table(this, "crawlUrlsTable", {
    partitionKey: { name: "url", type: AttributeType.STRING },
    replicationRegions: ["us-east-2"],
    stream: StreamViewType.NEW_AND_OLD_IMAGES,
    timeToLiveAttribute: "ttl",
    billingMode: BillingMode.PAY_PER_REQUEST
  });

  public eventSource = new DynamoEventSource(this.table, {
    startingPosition: StartingPosition.TRIM_HORIZON,
    maxBatchingWindow: Duration.seconds(2),
    parallelizationFactor: 4,
    retryAttempts: 4,
    batchSize: 40
  });

  public grantAll(grantee: IGrantable): void {
    this.table.grantWriteData(grantee);
    this.table.grantStreamRead(grantee);
  }
}
