import { Database, DataFormat, Table } from "@aws-cdk/aws-glue";
import { PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Construct, Stack } from "@aws-cdk/core";

import { CrawlMetrics } from "../../metrics/metrics-list";

export class DeliverySchema extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
    this.attachRoles();
  }

  private schemaDatabase = new Database(this, "SchemaDatabase", { databaseName: "schema-database" });
  private schemaTable = new Table(this, "SchemaTable", {
    database: this.schemaDatabase,
    tableName: "metadata-table",
    columns: new CrawlMetrics().getGlueColumns(),
    dataFormat: DataFormat.PARQUET,
  });

  private deliveryStreamGlueRole = new Role(this, "DeliveryStreamGlueRole", {
    assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
  });

  public getSchemaConfiguration(): CfnDeliveryStream.SchemaConfigurationProperty {
    return {
      catalogId: this.schemaDatabase.catalogId,
      databaseName: this.schemaDatabase.databaseName,
      tableName: this.schemaTable.tableName,
      region: Stack.of(this).region,
      roleArn: this.deliveryStreamGlueRole.roleArn,
      versionId: "LATEST",
    };
  }

  private attachRoles(): void {
    this.deliveryStreamGlueRole.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: ["glue:GetTableVersions", "glue:GetTable", "glue:CreateDatabase"],
      })
    );
  }
}