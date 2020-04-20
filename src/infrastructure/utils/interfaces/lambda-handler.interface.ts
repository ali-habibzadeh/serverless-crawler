export type PublicFn = (e: AWSLambda.APIGatewayEvent, c?: AWSLambda.Context) => Promise<any>;

export interface ILambdaHandlerFactoryConfig {
  [key: string]: PublicFn;
}

export interface ILambdaHandlers {
  [key: string]: AWSLambda.Handler;
}
