import { JsonSchemaType } from "@aws-cdk/aws-apigateway";
import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct, Tag } from "@aws-cdk/core";

import { LambdaApiFactory } from "../utils/lambda-api.factory";

export class StartCrawlRestApi extends Construct {
  constructor(parent: Construct, id: string, private startHandler: Fn) {
    super(parent, id);
    this.defineApiMethods();
    this.addTags();
  }

  public api = new LambdaApiFactory(this, this.startHandler).getApi();

  private validator = this.api.addRequestValidator("DefaultValidator", {
    validateRequestBody: true,
    validateRequestParameters: false
  });

  private defineApiMethods(): void {
    const crawlResource = this.api.root.addResource("crawl");
    crawlResource.addMethod("POST", undefined, {
      requestModels: {
        "application/json": this.crawlUrlModel
      },
      requestValidator: this.validator
    });
  }

  private crawlUrlModel = this.api.addModel("CrawlUrl", {
    schema: {
      type: JsonSchemaType.OBJECT,
      properties: {
        url: {
          pattern:
            "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})",
          type: JsonSchemaType.STRING
        }
      },
      required: ["url"]
    }
  });

  private addTags(): void {
    Tag.add(this.api, "description", "Api POST method for starting a crawl");
  }
}
