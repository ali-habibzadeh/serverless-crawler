import { Context } from "aws-lambda";

import { LambdaHandlers } from "./handlers-list";
import { AlexaHandler } from "./handlers/alexa.handler";
import { LambdaHandlerFactory } from "./infrastructure/utils/lambda-handler.factory";

const handlers: Record<LambdaHandlers, (e: AWSLambda.APIGatewayEvent, c?: Context) => Promise<any>> = {
  [LambdaHandlers.alexaHandler]: (e, c) => new AlexaHandler(e, c).writeMessaage(),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
