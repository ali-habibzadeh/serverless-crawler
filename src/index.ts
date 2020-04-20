import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { LambdaHandlers } from "./handlers-list";
import { AlexaHandler } from "./handlers/alexa.handler";

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.alexaHandler]: (e) => new AlexaHandler(e).respond(),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
