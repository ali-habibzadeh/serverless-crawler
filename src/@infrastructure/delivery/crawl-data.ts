import { PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { Construct, Tag } from "@aws-cdk/core";

import { BucketFactory } from "../utils/bucket.factory";

export class CrawlData extends Construct {
  constructor(parent: Construct, id: string) {
    super(parent, id);
    this.attachRole();
    this.addTags();
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

  private addTags(): void {
    Tag.add(this.crawlDataBucket, "description", "S3 Bucket for storing crawl data");
  }
}
