import { PolicyStatement } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Construct, Tag } from "@aws-cdk/core";

import { CrawlData } from "./crawl-data";
import { DeliverySchema } from "./delivery-schema";

export class DeliveryStream extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
    this.addTags();
  }

  public crawlData = new CrawlData(this, "CrawlDataBucket");

  public crawlDatasDeliveryStream = new CfnDeliveryStream(this, "CrawlDataDeliveryStream", {
    deliveryStreamName: "crawlDataDeliveryStream",
    deliveryStreamType: "DirectPut",
    extendedS3DestinationConfiguration: {
      dataFormatConversionConfiguration: {
        schemaConfiguration: new DeliverySchema(this, "DeliverySchema").getSchemaConfiguration(),
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
      roleArn: this.crawlData.deliveryStreamS3Role.roleArn,
      prefix: "crawl-data/"
    }
  });

  public getWritingPolicy(): PolicyStatement {
    return new PolicyStatement({
      resources: [this.crawlDatasDeliveryStream.attrArn],
      actions: ["firehose:PutRecord", "firehose:PutRecordBatch", "firehose:UpdateDestination"]
    });
  }

  private addTags(): void {
    Tag.add(
      this.crawlDatasDeliveryStream,
      "description",
      "Kenisis Firehose steam for deliverying crawl data from lambda to s3"
    );
  }
}
