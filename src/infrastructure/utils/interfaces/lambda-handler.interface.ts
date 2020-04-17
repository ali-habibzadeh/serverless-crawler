import { Context as LambdaContext } from "aws-lambda";

export type PublicFn = (event?: any, context?: LambdaContext) => Promise<any>;

export interface ILambdaHandlerFactoryConfig {
  [key: string]: PublicFn;
}

export interface ILambdaHandlers {
  [key: string]: AWSLambda.Handler;
}
