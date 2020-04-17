import { ILambdaHandlerFactoryConfig, ILambdaHandlers, PublicFn } from "./interfaces/lambda-handler.interface";

export class LambdaHandlerFactory {
  private entries = Object.entries(this.configs);
  constructor(private configs: ILambdaHandlerFactoryConfig) {}

  public getHandlers(): ILambdaHandlers {
    return this.entries.reduce((configs, [name, fn]) => {
      return {
        ...configs,
        [name]: this.getHandler(fn),
      };
    }, {});
  }

  private getHandler(body: PublicFn): AWSLambda.Handler {
    return async (event, context): Promise<any> => {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: await body(event, context),
      };
    };
  }
}
