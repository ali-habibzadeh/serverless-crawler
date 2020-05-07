import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

import { LambdaApiFactory } from "../utils/lambda-api.factory";

export class StartCrawlRestApi extends Construct {
  constructor(parent: Construct, id: string, private startHandler: Fn) {
    super(parent, id);
  }

  public api = new LambdaApiFactory(this, this.startHandler).getApi();

  private validator = this.api.addRequestValidator("DefaultValidator", {
    validateRequestBody: false,
    validateRequestParameters: true,
  });

  private defineApiMethods(): void {
    const alexa = this.api.root.addResource("crawl");
    alexa.addMethod("POST", undefined, {
      requestModels: {},
      requestValidator: this.validator,
    });
  }
}
