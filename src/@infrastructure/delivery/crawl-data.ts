import { PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";

import { BucketFactory } from "../utils/bucket.factory";

export class CrawlData extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
    this.attachRole();
  }

  public crawlDataBucket = new BucketFactory(this, "CrawlDataBucket").getBucket();

  public deliveryStreamS3Role = new Role(this, "DeliveryStreamS3Role", {
    assumedBy: new ServicePrincipal("firehose.amazonaws.com")
  });

  private attachRole(): void {
    this.deliveryStreamS3Role.addToPolicy(
      new PolicyStatement({
        resources: [this.crawlDataBucket.bucketArn, `${this.crawlDataBucket.bucketArn}/*`],
        actions: ["s3:GetBucketLocation", "s3:GetObject", "s3:ListBucket", "s3:PutObject"]
      })
    );
  }
}
