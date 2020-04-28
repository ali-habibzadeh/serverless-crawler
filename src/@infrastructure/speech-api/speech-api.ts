import { EventBus } from "@aws-cdk/aws-events";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { EventBridgeDestination } from "@aws-cdk/aws-lambda-destinations";
import { CfnOutput, Construct } from "@aws-cdk/core";

import { envVars } from "../../config/envars.enum";
import { LambdaHandlers } from "../../handlers-list";
import { BucketFactory } from "../utils/bucket.factory";
import { LambdaApiFactory } from "../utils/lambda-api.factory";
import { LambdaFactory } from "../utils/lambda.factory";

export class SpeechApi {
  constructor(private parent: Construct) {
    this.defineApiMethods();
    this.speechBucket.grantPut(this.speechLambda);
    this.speechLambda.addToRolePolicy(new PolicyStatement({ actions: ["polly:*"], resources: ["*"] }));
  }

  private speechBucket = new BucketFactory(this.parent, "SpeechBucketId").getBucket();

  public bucketOutput = new CfnOutput(this.parent, envVars.speechBucketName, {
    value: this.speechBucket.bucketName,
  });

  private speechEventBus = new EventBus(this.parent, "SpeechEventBus", {
    eventBusName: envVars.speechEventBusName,
  });

  private speechLambda = new LambdaFactory(this.parent, LambdaHandlers.SpeechHandler, {
    environment: {
      [envVars.speechBucketName]: this.speechBucket.bucketName,
      [envVars.speechEventBusName]: this.speechEventBus.eventBusName,
    },
    onSuccess: new EventBridgeDestination(this.speechEventBus),
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
