import { JsonSchemaType } from "@aws-cdk/aws-apigateway";
import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

import { LambdaApiFactory } from "../utils/lambda-api.factory";

export class StartCrawlRestApi extends Construct {
  constructor(parent: Construct, id: string, private startHandler: Fn) {
    super(parent, id);
    this.defineApiMethods();
  }

  public api = new LambdaApiFactory(this, this.startHandler).getApi();

  private validator = this.api.addRequestValidator("DefaultValidator", {
    validateRequestBody: true,
    validateRequestParameters: false,
  });

  private defineApiMethods(): void {
    const crawlResource = this.api.root.addResource("crawl");
    crawlResource.addMethod("POST", undefined, {
      requestModels: {
        "application/json": this.crawlUrlModel,
      },
      requestValidator: this.validator,
    });
  }

  private crawlUrlModel = this.api.addModel("CrawlUrl", {
    schema: {
      type: JsonSchemaType.OBJECT,
      properties: {
        url: {
          pattern: "@(https?)://(-.)?([^s/?.#-]+.?)+(/[^s]*)?$@iS",
          type: JsonSchemaType.STRING,
        },
      },
      required: ["url"],
    },
  });
}
