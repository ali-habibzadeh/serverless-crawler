import { App, CfnOutput, Construct, Stack, StackProps, Tag } from "@aws-cdk/core";

import { envVars } from "../config/envars.enum";
import { LambdaHandlers } from "../handlers-list";
import { StartCrawlRestApi } from "./api/crawler-api";
import { CrawlUrlsTable } from "./crawl-urls/crawl-urls-table";
import { DeliveryStream } from "./delivery/delivery-stream";
import { LambdaFactory } from "./utils/lambda.factory";
import { RenderingCluster } from "./rendering/rendering";
import { Vpc } from "@aws-cdk/aws-ec2";

export class ServerlessCrawlerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.configure();
    this.addTags();
  }

  public vpc = new Vpc(this, "ServerlessCrawlerVpc");
  public regionOutput = new CfnOutput(this, "region", { value: this.region });
  public crawlUrlsTable = new CrawlUrlsTable(this, "CrawlUrlsDynamodb");
  public deliveryStream = new DeliveryStream(this, "DeliveryStream");
  public renderingCluster = new RenderingCluster(this, "RenderingClusterContainer", this.vpc);

  public lambdaEnv = {
    [envVars.crawlUrlsTableName]: this.crawlUrlsTable.table.tableName,
    [envVars.crawlDataBucketName]: this.deliveryStream.crawlData.crawlDataBucket.bucketName,
    [envVars.crawlDataDeliveryStreamName]: this.deliveryStream.crawlDatasDeliveryStream.deliveryStreamName,
    [envVars.chromeClusterDns]: this.renderingCluster.loadBalancedService.loadBalancer.loadBalancerDnsName,
    [envVars.chromeClusterPort]: this.renderingCluster.port.toString(),
    [envVars.deliveryStreamDbName]: this.deliveryStream.deliverySchema.schemaDatabase.databaseName,
    [envVars.deliveryStreamCatalogId]: this.deliveryStream.deliverySchema.schemaDatabase.catalogId,
    [envVars.deliveryStreamMetricsTableName]: this.deliveryStream.deliverySchema.schemaTable.tableName
  };

  public streamHandler = new LambdaFactory(this, LambdaHandlers.StreamProcessorHandler, {
    environment: this.lambdaEnv,
    reservedConcurrentExecutions: 40
  }).getLambda();

  public startCrawlHandler = new LambdaFactory(this, LambdaHandlers.StartCrawlHandler, {
    environment: this.lambdaEnv
  }).getLambda();

  public startCrawlRestApi = new StartCrawlRestApi(this, "startCrawlRestApi", this.startCrawlHandler);

  private configure(): void {
    [this.streamHandler, this.startCrawlHandler].forEach(lambda => {
      this.crawlUrlsTable.grantNecessaryRights(lambda);
      lambda.addToRolePolicy(this.deliveryStream.getWritingPolicy());
    });
    this.streamHandler.addEventSource(this.crawlUrlsTable.eventSource);
  }

  private addTags(): void {
    Tag.add(this.streamHandler, "description", "Function for processing dynamodb streams");
    Tag.add(this.startCrawlHandler, "description", "Function triggering the very first dynamodb stream");
  }
}

console.log("GITHUB_REF", process.env.GITHUB_REF);

const app = new App();
new ServerlessCrawlerStack(app, "serverless-cralwer");
app.synth();
