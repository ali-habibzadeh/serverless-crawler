import { APIGatewayProxyResult } from "aws-lambda";

import { ILambdaHandlerFactoryConfig, ILambdaHandlers, PublicFn } from "./interfaces/lambda-handler.interface";

export class LambdaHandlerFactory {
  private entries = Object.entries(this.configs);
  constructor(private configs: ILambdaHandlerFactoryConfig) {}
  private defaultConfig = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  };

  public getHandlers(): ILambdaHandlers {
    return this.entries.reduce((configs, [name, fn]) => {
      return {
        ...configs,
        [name]: this.getHandler(fn)
      };
    }, {});
  }

  private getHandler(fn: PublicFn): AWSLambda.Handler {
    return async (event, context): Promise<APIGatewayProxyResult> => {
      const results = await fn(event, context);
      return {
        ...this.defaultConfig,
        body: JSON.stringify(results)
      };
    };
  }
}
