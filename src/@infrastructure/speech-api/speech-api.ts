import { PolicyStatement } from "@aws-cdk/aws-iam";
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";

import { LambdaHandlers } from "../../handlers-list";
import { LambdaApiFactory } from "../utils/lambda-api.factory";
import { LambdaFactory } from "../utils/lambda.factory";

export class SpeechApi {
  constructor(private parent: Construct) {
    this.defineApiMethods();
    this.speechBucket.grantPut(this.speechLambda);
    this.speechLambda.addToRolePolicy(new PolicyStatement({ actions: ["polly:*"], resources: ["*"] }));
  }

  private speechBucket = new Bucket(this.parent, "SpeechBucket", {
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    encryption: BucketEncryption.S3_MANAGED,
  });

  private speechLambda = new LambdaFactory(this.parent, LambdaHandlers.SpeechHandler, {
    speechBucketName: this.speechBucket.bucketName,
  }).getLambda();

  public speechApi = new LambdaApiFactory(this.parent, this.speechLambda).getApi();

  private validator = this.speechApi.addRequestValidator("DefaultValidator", {
    validateRequestBody: false,
    validateRequestParameters: true,
  });

  private defineApiMethods(): void {
    const alexa = this.speechApi.root.addResource("speech");
    alexa.addMethod("GET", undefined, {
      requestParameters: {
        "method.request.querystring.message": true,
      },
      requestValidator: this.validator,
    });
  }
}
