import { Cors, LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { Construct } from "@aws-cdk/core";

import { LambdaHandlers } from "../../handlers-list";
import { createLambda } from "../utils/lambda.factory";

export class AlexaApi {
  constructor(private parent: Construct) {
    this.defineApiMethods();
  }

  public alexaLambda = createLambda(this.parent, "alexa-lambda", "myAlexaFunction", LambdaHandlers.alexaHandler);

  public alexaRestApi = new LambdaRestApi(this.parent, "alexa-api-handler", {
    handler: this.alexaLambda,
    proxy: false,
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
  });

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
