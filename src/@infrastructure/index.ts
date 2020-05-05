import { AttributeType, StreamViewType, Table } from "@aws-cdk/aws-dynamodb";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { StartingPosition } from "@aws-cdk/aws-lambda";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { App, CfnOutput, Construct, Duration, Stack, StackProps } from "@aws-cdk/core";

import { envVars } from "../config/envars.enum";
import { LambdaHandlers } from "../handlers-list";
import { DeliverySteam as DeliveryStream } from "./delivery/delivery-stream";
import { LambdaFactory } from "./utils/lambda.factory";

export class ServerlessCrawlerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.configure();
  }

  public regionOutput = new CfnOutput(this, "region", { value: this.region });

  public crawlUrlsTable = new Table(this, "crawlUrlsTable", {
    partitionKey: { name: "url", type: AttributeType.STRING },
    replicationRegions: ["us-east-2"],
    stream: StreamViewType.NEW_AND_OLD_IMAGES,
  });

  public deliveryStream = new DeliveryStream(this, "DeliveryStream");

  public startHandler = new LambdaFactory(this, LambdaHandlers.StartCrawlHandler, {
    environment: {
      [envVars.crawlUrlsTableName]: this.crawlUrlsTable.tableName,
      [envVars.crawlDataBucketName]: this.deliveryStream.crawlData.crawlDataBucket.bucketName,
      [envVars.crawlDataDeliveryStreamName]: this.deliveryStream.crawlDatasDeliveryStream.deliveryStreamName,
    },
    reservedConcurrentExecutions: 20,
  }).getLambda();

  private configure(): void {
    this.crawlUrlsTable.grantReadWriteData(this.startHandler);
    this.attachStartHandlerEventSource();
    this.grantStartHandlerFireosePermission();
  }

  private attachStartHandlerEventSource(): void {
    this.startHandler.addEventSource(
      new DynamoEventSource(this.crawlUrlsTable, {
        startingPosition: StartingPosition.LATEST,
        maxBatchingWindow: Duration.seconds(2),
        parallelizationFactor: 1,
        retryAttempts: 4,
        batchSize: 30,
      })
    );
  }

  private grantStartHandlerFireosePermission(): void {
    this.startHandler.addToRolePolicy(
      new PolicyStatement({
        resources: [this.deliveryStream.crawlDatasDeliveryStream.attrArn],
        actions: ["firehose:PutRecord", "firehose:PutRecordBatch", "firehose:UpdateDestination"],
      })
    );
  }
}

console.log("GITHUB_REF", process.env.GITHUB_REF);

const app = new App();
new ServerlessCrawlerStack(app, "serverless-cralwer");
app.synth();
