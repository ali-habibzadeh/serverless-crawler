import { PolicyStatement } from "@aws-cdk/aws-iam";
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";

import { LambdaHandlers } from "../../handlers-list";
import { LambdaApiFactory } from "../utils/lambda-api.factory";
import { LambdaFactory } from "../utils/lambda.factory";

export class Text2SpeechApi {
  constructor(private parent: Construct) {
    this.defineApiMethods();
    this.messageBucket.grantPut(this.text2SLambda);
    this.text2SLambda.addToRolePolicy(new PolicyStatement({ actions: ["polly:*"], resources: ["*"] }));
  }

  private messageBucket = new Bucket(this.parent, "MessageBucket", {
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    encryption: BucketEncryption.S3_MANAGED,
  });

  private text2SLambda = new LambdaFactory(this.parent, LambdaHandlers.text2SHandler, {
    messageBucketName: this.messageBucket.bucketName,
  }).getLambda();

  public text2speechApi = new LambdaApiFactory(this.parent, this.text2SLambda).getApi();

  private validator = this.text2speechApi.addRequestValidator("DefaultValidator", {
    validateRequestBody: false,
    validateRequestParameters: true,
  });

  private defineApiMethods(): void {
    const alexa = this.text2speechApi.root.addResource("speech");
    alexa.addMethod("GET", undefined, {
      requestParameters: {
        "method.request.querystring.message": true,
      },
      requestValidator: this.validator,
    });
  }
}
