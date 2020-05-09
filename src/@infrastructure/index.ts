import { App, CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";

import { envVars } from "../config/envars.enum";
import { LambdaHandlers } from "../handlers-list";
import { StartCrawlRestApi } from "./api/crawler-api";
import { CrawlUrlsTable } from "./crawl-urls/crawl-urls-table";
import { DeliveryStream } from "./delivery/delivery-stream";
import { LambdaFactory } from "./utils/lambda.factory";

export class ServerlessCrawlerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.configure();
  }

  public regionOutput = new CfnOutput(this, "region", { value: this.region });
  public crawlUrlsTable = new CrawlUrlsTable(this, "CrawlUrlsDynamodb");
  public deliveryStream = new DeliveryStream(this, "DeliveryStream");

  public lambdaEnv = {
    [envVars.crawlUrlsTableName]: this.crawlUrlsTable.table.tableName,
    [envVars.crawlDataBucketName]: this.deliveryStream.crawlData.crawlDataBucket.bucketName,
    [envVars.crawlDataDeliveryStreamName]: this.deliveryStream.crawlDatasDeliveryStream.deliveryStreamName,
  };

  public streamHandler = new LambdaFactory(this, LambdaHandlers.StreamProcessorHandler, {
    environment: this.lambdaEnv,
    reservedConcurrentExecutions: 20,
  }).getLambda();

  public startCrawlHandler = new LambdaFactory(this, LambdaHandlers.StartCrawlHandler, {
    environment: this.lambdaEnv,
  }).getLambda();

  public startCrawlRestApi = new StartCrawlRestApi(this, "StartCrawlRestApi", this.startCrawlHandler);

  private configure(): void {
    const urlWriterLamdas = [this.streamHandler, this.startCrawlHandler];
    urlWriterLamdas.forEach((lambda) => {
      this.crawlUrlsTable.table.grantReadWriteData(lambda);
      lambda.addToRolePolicy(this.deliveryStream.getWritingPolicy());
    });
    this.streamHandler.addEventSource(this.crawlUrlsTable.eventSource);
  }
}

console.log("GITHUB_REF", process.env.GITHUB_REF);

const app = new App();
new ServerlessCrawlerStack(app, "serverless-cralwer");
app.synth();
