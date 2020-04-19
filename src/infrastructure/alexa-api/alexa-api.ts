import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";

import { LambdaHandlers } from "../../handlers-list";
import { LambdaApiFactory } from "../utils/lambda-api.factory";
import { LambdaFactory } from "../utils/lambda.factory";

export class AlexaApi {
  constructor(private parent: Construct) {
    this.defineApiMethods();
    this.messageBucket.grantPut(this.alexaLambda);
  }

  private messageBucket = new Bucket(this.parent, "MessageBucket", {
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    encryption: BucketEncryption.S3_MANAGED,
  });

  private alexaLambda = new LambdaFactory(this.parent, LambdaHandlers.alexaHandler, {
    messageBucketName: this.messageBucket.bucketName,
  }).getLambda();

  public alexaRestApi = new LambdaApiFactory(this.parent, this.alexaLambda).getApi();

  private validator = this.alexaRestApi.addRequestValidator("DefaultValidator", {
    validateRequestBody: false,
    validateRequestParameters: true,
  });

  private defineApiMethods(): void {
    const alexa = this.alexaRestApi.root.addResource("alexa");
    alexa.addMethod("GET", undefined, {
      requestParameters: {
        "method.request.querystring.message": true,
      },
      requestValidator: this.validator,
    });
  }
}
