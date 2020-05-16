import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";

export class BucketFactory {
  constructor(private parent: Construct, private id: string) {}
  public getBucket(): Bucket {
    return new Bucket(this.parent, this.id, {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED
    });
  }
}
