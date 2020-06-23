import { App, CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";

import { envVars } from "../config/envars.enum";
import { LambdaHandlers } from "../handlers-list";
import { StartCrawlRestApi } from "./api/crawler-api";
import { CrawlUrlsTable } from "./crawl-urls/crawl-urls-table";
import { DeliveryStream } from "./delivery/delivery-stream";
import { LambdaFactory } from "./utils/lambda.factory";
import { RenderingCluster } from "./rendering/rendering";
import { Vpc } from "@aws-cdk/aws-ec2";
import { CustomMetricsTable } from "./custom-metrics/custom-metrics";
import { CustomMetricsRestApi } from "./api/custom-metrics.api";
import { QueryTesterSocketsApi } from "./api/query-tester.api";
import { SitemapUrlsTable } from "./sitemap-urls/sitemap-urls-table";

export class ServerlessCrawlerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.configure();
  }

  public vpc = new Vpc(this, "ServerlessCrawlerVpc");
  public regionOutput = new CfnOutput(this, "region", { value: this.region });
  public crawlUrlsTable = new CrawlUrlsTable(this, "CrawlUrlsDynamodb");
  public sitemapUrlsTable = new SitemapUrlsTable(this, "SitemapUrlsDynamodb");
  public deliveryStream = new DeliveryStream(this, "DeliveryStream");
  public renderingCluster = new RenderingCluster(this, "RenderingClusterContainer", this.vpc);
  public customMetricsTable = new CustomMetricsTable(this);

  public lambdaEnv = {
    [envVars.crawlUrlsTableName]: this.crawlUrlsTable.table.tableName,
    [envVars.sitemapUrlsTableName]: this.sitemapUrlsTable.table.tableName,
    [envVars.crawlDataBucketName]: this.deliveryStream.crawlData.crawlDataBucket.bucketName,
    [envVars.crawlDataDeliveryStreamName]: this.deliveryStream.crawlDatasDeliveryStream.deliveryStreamName,
    [envVars.chromeClusterDns]: this.renderingCluster.loadBalancedService.loadBalancer.loadBalancerDnsName,
    [envVars.chromeClusterPort]: this.renderingCluster.port.toString(),
    [envVars.deliveryStreamDbName]: this.deliveryStream.deliverySchema.schemaDatabase.databaseName,
    [envVars.deliveryStreamCatalogId]: this.deliveryStream.deliverySchema.schemaDatabase.catalogId,
    [envVars.deliveryStreamMetricsTableName]: this.deliveryStream.deliverySchema.schemaTable.tableName,
    [envVars.customMetricsTableName]: this.customMetricsTable.table.tableName
  };

  public urlsCrawlHandler = new LambdaFactory(this, LambdaHandlers.UrlsCrawlHandler, {
    environment: this.lambdaEnv,
    reservedConcurrentExecutions: 40
  }).getLambda();

  public sitemapCrawlHandler = new LambdaFactory(this, LambdaHandlers.SitemapCrawlHandler, {
    environment: this.lambdaEnv,
    reservedConcurrentExecutions: 40
  }).getLambda();

  public startCrawlHandler = new LambdaFactory(this, LambdaHandlers.StartCrawlHandler, {
    environment: this.lambdaEnv
  }).getLambda();

  public customMetricsHandler = new LambdaFactory(this, LambdaHandlers.CustomMetricsHandler, {
    environment: this.lambdaEnv
  }).getLambda();

  public queryTesterHandler = new LambdaFactory(this, LambdaHandlers.QueryTesterHandler, {
    environment: this.lambdaEnv
  }).getLambda();

  private allHandlers = [
    this.urlsCrawlHandler,
    this.sitemapCrawlHandler,
    this.startCrawlHandler,
    this.customMetricsHandler,
    this.queryTesterHandler
  ];

  public startCrawlRestApi = new StartCrawlRestApi(this, "startCrawlRestApi", this.startCrawlHandler);
  public customMetricsRestApi = new CustomMetricsRestApi(this, "customMetricsRestApi", this.customMetricsHandler);
  public queryTesterSocketsApi = new QueryTesterSocketsApi(this, "queryTesterSocketsApi", this.queryTesterHandler);

  private configure(): void {
    this.allHandlers.forEach(lambda => {
      this.crawlUrlsTable.applyGrants(lambda);
      this.sitemapUrlsTable.applyGrants(lambda);
      this.customMetricsTable.applyGrants(lambda);
      this.deliveryStream.crawlData.crawlDataBucket.grantReadWrite(lambda);
      lambda.addToRolePolicy(this.deliveryStream.getWritingPolicy());
      lambda.addToRolePolicy(this.deliveryStream.deliverySchema.getCatalogPolicy());
      lambda.addToRolePolicy(this.queryTesterSocketsApi.getConnectionsPolicy());
      this.deliveryStream.deliverySchema.schemaTable.grantReadWrite(lambda);
    });
    this.urlsCrawlHandler.addEventSource(this.crawlUrlsTable.eventSource);
    this.sitemapCrawlHandler.addEventSource(this.sitemapUrlsTable.eventSource);
  }
}

console.log("GITHUB_REF", process.env.GITHUB_REF);

const app = new App();
new ServerlessCrawlerStack(app, "serverless-cralwer");
app.synth();
