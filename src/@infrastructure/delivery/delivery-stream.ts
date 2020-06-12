import { PolicyStatement } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Construct } from "@aws-cdk/core";

import { CrawlData } from "./crawl-data";
import { DeliverySchema } from "./delivery-schema";

export class DeliveryStream extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
  }

  public crawlData = new CrawlData(this, "CrawlDataBucket");
  public deliverySchema = new DeliverySchema(this, "DeliverySchema");

  public crawlDatasDeliveryStream = new CfnDeliveryStream(this, "CrawlDataDeliveryStream", {
    deliveryStreamName: "crawlDataDeliveryStream",
    deliveryStreamType: "DirectPut",
    extendedS3DestinationConfiguration: {
      dataFormatConversionConfiguration: {
        schemaConfiguration: this.deliverySchema.getSchemaConfiguration(),
        enabled: true,
        inputFormatConfiguration: {
          deserializer: {
            openXJsonSerDe: {
              caseInsensitive: false,
              convertDotsInJsonKeysToUnderscores: false
            }
          }
        },
        outputFormatConfiguration: {
          serializer: {
            parquetSerDe: {
              compression: "GZIP"
            }
          }
        }
      },
      bucketArn: this.crawlData.crawlDataBucket.bucketArn,
      compressionFormat: "UNCOMPRESSED",
      bufferingHints: {
        intervalInSeconds: 60,
        sizeInMBs: 64
      },
      roleArn: this.crawlData.deliveryStreamS3Role.roleArn
    }
  });

  public getWritingPolicy(): PolicyStatement {
    return new PolicyStatement({
      resources: [this.crawlDatasDeliveryStream.attrArn],
      actions: [
        "firehose:PutRecord",
        "firehose:PutRecordBatch",
        "firehose:UpdateDestination",
        "firehose:DescribeDeliveryStream"
      ]
    });
  }
}
