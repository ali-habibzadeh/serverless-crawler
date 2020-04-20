import { Cors, LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

export class LambdaApiFactory {
  constructor(private parent: Construct, private fn: Fn) {}

  public getApi(): LambdaRestApi {
    return new LambdaRestApi(this.parent, `RestApi-${this.fn.node.uniqueId}`, {
      handler: this.fn,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });
  }
}
