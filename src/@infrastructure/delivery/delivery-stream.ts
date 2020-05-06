import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Construct } from "@aws-cdk/core";

import { CrawlData } from "./crawl-data";
import { DeliverySchema } from "./delivery-schema";

export class DeliverySteam extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
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
              convertDotsInJsonKeysToUnderscores: false,
            },
          },
        },
        outputFormatConfiguration: {
          serializer: {
            parquetSerDe: {
              compression: "GZIP",
            },
          },
        },
      },
      bucketArn: this.crawlData.crawlDataBucket.bucketArn,
      compressionFormat: "GZIP",
      bufferingHints: {
        intervalInSeconds: 60,
        sizeInMBs: 64,
      },
      roleArn: this.crawlData.deliveryStreamS3Role.roleArn,
    },
  });
}
