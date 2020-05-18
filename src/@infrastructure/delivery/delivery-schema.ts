import { Database, DataFormat, Table } from "@aws-cdk/aws-glue";
import { PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Construct, Stack, Tag } from "@aws-cdk/core";

import { getGlueColumns } from "../../metrics/metrics-list";

export class DeliverySchema extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
    this.attachRoles();
    this.addTags();
  }

  private schemaDatabase = new Database(this, "SchemaDatabase", { databaseName: "schema_database" });
  private schemaTable = new Table(this, "SchemaTable", {
    database: this.schemaDatabase,
    tableName: "metadata_table",
    columns: getGlueColumns(),
    dataFormat: DataFormat.PARQUET
  });

  private deliveryStreamGlueRole = new Role(this, "DeliveryStreamGlueRole", {
    assumedBy: new ServicePrincipal("firehose.amazonaws.com")
  });

  public getSchemaConfiguration(): CfnDeliveryStream.SchemaConfigurationProperty {
    return {
      catalogId: this.schemaDatabase.catalogId,
      databaseName: this.schemaDatabase.databaseName,
      tableName: this.schemaTable.tableName,
      region: Stack.of(this).region,
      roleArn: this.deliveryStreamGlueRole.roleArn,
      versionId: "LATEST"
    };
  }

  private attachRoles(): void {
    this.deliveryStreamGlueRole.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: ["glue:GetTableVersions", "glue:GetTable", "glue:CreateDatabase"]
      })
    );
  }

  private addTags(): void {
    Tag.add(this.schemaDatabase, "description", "Glue database for crawl data schema");
    Tag.add(this.schemaTable, "description", "Glue table holding column schema for crawl data");
  }
}
