import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { StartingPosition } from "@aws-cdk/aws-lambda";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { App, CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";

import { envVars } from "../config/envars.enum";
import { LambdaHandlers } from "../handlers-list";
import { LambdaFactory } from "./utils/lambda.factory";

export class ServerlessCrawlerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.crawlUrlsTable.grantReadWriteData(this.startHandler);

    this.startHandler.addEventSource(
      new DynamoEventSource(this.crawlUrlsTable, {
        startingPosition: StartingPosition.LATEST,
      })
    );
  }
  public regionOutput = new CfnOutput(this, "region", { value: this.region });

  public crawlUrlsTable = new Table(this, "crawlUrlsTable", {
    partitionKey: { name: "url", type: AttributeType.STRING },
  });

  public startHandler = new LambdaFactory(this, LambdaHandlers.StartCrawlHandler, {
    environment: { [envVars.crawlUrlsTableName]: this.crawlUrlsTable.tableName },
  }).getLambda();
}

console.log("GITHUB_REF", process.env.GITHUB_REF);

const app = new App();
new ServerlessCrawlerStack(app, "serverless-cralwer");
app.synth();
