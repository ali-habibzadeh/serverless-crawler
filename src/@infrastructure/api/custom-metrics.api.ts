import { JsonSchemaType } from "@aws-cdk/aws-apigateway";
import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

import { LambdaApiFactory } from "../utils/lambda-api.factory";

export class CustomMetricsRestApi extends Construct {
  constructor(parent: Construct, id: string, private customMetricsRestApi: Fn) {
    super(parent, id);
    this.defineApiMethods();
  }

  public api = new LambdaApiFactory(this, this.customMetricsRestApi).getApi();

  private validator = this.api.addRequestValidator("DefaultValidator", {
    validateRequestBody: true,
    validateRequestParameters: false
  });

  private defineApiMethods(): void {
    const crawlResource = this.api.root.addResource("metrics");
    crawlResource.addMethod("POST", undefined, {
      requestModels: {
        "application/json": this.crawlUrlModel
      },
      requestValidator: this.validator
    });
    crawlResource.addMethod("GET", undefined, {});
  }

  private crawlUrlModel = this.api.addModel("CustomMetrics", {
    schema: {
      type: JsonSchemaType.OBJECT,
      properties: {
        fn: {
          type: JsonSchemaType.STRING
        },
        id: {
          type: JsonSchemaType.STRING
        },
        type: {
          type: JsonSchemaType.STRING
        }
      },
      required: ["type", "id", "fn"]
    }
  });
}
