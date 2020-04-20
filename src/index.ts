import { Context } from "aws-lambda";

import { LambdaHandlers } from "./handlers-list";
import { AlexaHandler } from "./handlers/alexa.handler";
import { LambdaHandlerFactory } from "./infrastructure/utils/lambda-handler.factory";

type HandlerFunction = (e: AWSLambda.APIGatewayEvent, c?: Context) => Promise<any>;

const handlers: Record<LambdaHandlers, HandlerFunction> = {
  [LambdaHandlers.alexaHandler]: (e) => new AlexaHandler(e).writeMessaage(),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
