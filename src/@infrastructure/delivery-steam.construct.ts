import { PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Construct } from "@aws-cdk/core";

import { BucketFactory } from "./utils/bucket.factory";

export class DeliverySteam extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
    this.configure();
  }

  public crawlDataBucket = new BucketFactory(this, "CrawlDataBucket").getBucket();

  private deliverySteamRole = new Role(this, "DeliverySteamRole", {
    assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
  });

  public crawlDatasDeliveryStream = new CfnDeliveryStream(this, "CrawlDataDeliveryStream", {
    deliveryStreamType: "DIRECTPUT",
    extendedS3DestinationConfiguration: {
      bucketArn: this.crawlDataBucket.bucketArn,
      compressionFormat: "UNCOMPRESSED",
      bufferingHints: {
        intervalInSeconds: 100,
        sizeInMBs: 5,
      },
      roleArn: this.deliverySteamRole.roleArn,
    },
  });

  private configure(): void {
    this.deliverySteamRole.addToPolicy(
      new PolicyStatement({
        resources: [this.crawlDataBucket.bucketArn, `${this.crawlDataBucket.bucketArn}/*`],
        actions: [
          "s3:AbortMultipartUpload",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:ListBucketMultipartUploads",
          "s3:PutObject",
        ],
      })
    );
  }
}
