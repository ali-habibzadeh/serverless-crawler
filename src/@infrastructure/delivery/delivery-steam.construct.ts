import { Database, DataFormat, Schema, Table } from "@aws-cdk/aws-glue";
import { PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Construct, Stack } from "@aws-cdk/core";

import { BucketFactory } from "../utils/bucket.factory";

export class DeliverySteam extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
    this.configure();
  }

  public crawlDataBucket = new BucketFactory(this, "CrawlDataBucket").getBucket();

  private deliveryStreamS3Role = new Role(this, "DeliveryStreamS3Role", {
    assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
  });
  private deliveryStreamGlueRole = new Role(this, "DeliveryStreamGlueRole", {
    assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
  });

  private schemaDatabase = new Database(this, "SchemaDatabase", { databaseName: "schema-database" });
  private schemaTable = new Table(this, "SchemaTable", {
    database: this.schemaDatabase,
    tableName: "metadata-table",
    columns: [
      {
        name: "url",
        type: Schema.STRING,
      },
      {
        name: "status",
        type: Schema.INTEGER,
      },
    ],
    dataFormat: DataFormat.PARQUET,
  });

  public crawlDatasDeliveryStream = new CfnDeliveryStream(this, "CrawlDataDeliveryStream", {
    deliveryStreamName: "crawlDataDeliveryStream",
    deliveryStreamType: "DirectPut",
    extendedS3DestinationConfiguration: {
      dataFormatConversionConfiguration: {
        schemaConfiguration: {
          catalogId: this.schemaDatabase.catalogId,
          databaseName: this.schemaDatabase.databaseName,
          tableName: this.schemaTable.tableName,
          region: Stack.of(this).region,
          roleArn: this.deliveryStreamGlueRole.roleArn,
          versionId: "LATEST",
        },
        enabled: true,
        inputFormatConfiguration: {
          deserializer: {
            openXJsonSerDe: {
              caseInsensitive: false,
              convertDotsInJsonKeysToUnderscores: false,
            },
          },
        },
        outputFormatConfiguration: {
          serializer: {
            parquetSerDe: {
              compression: "UNCOMPRESSED",
            },
          },
        },
      },
      bucketArn: this.crawlDataBucket.bucketArn,
      compressionFormat: "UNCOMPRESSED",
      bufferingHints: {
        intervalInSeconds: 60,
        sizeInMBs: 1,
      },
      roleArn: this.deliveryStreamS3Role.roleArn,
    },
  });

  private configure(): void {
    this.deliveryStreamS3Role.addToPolicy(
      new PolicyStatement({
        resources: [this.crawlDataBucket.bucketArn, `${this.crawlDataBucket.bucketArn}/*`],
        actions: ["s3:GetBucketLocation", "s3:GetObject", "s3:ListBucket", "s3:PutObject"],
      })
    );
    this.deliveryStreamGlueRole.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: ["glue:GetTableVersions", "glue:GetTable", "glue:CreateDatabase"],
      })
    );
  }
}
