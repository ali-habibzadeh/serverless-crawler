export type PublicFn = (e: any, c?: AWSLambda.Context) => Promise<any>;

export interface ILambdaHandlerFactoryConfig {
  [key: string]: PublicFn;
}

export interface ILambdaHandlers {
  [key: string]: AWSLambda.Handler;
}
