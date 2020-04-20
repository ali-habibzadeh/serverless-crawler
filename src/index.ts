import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { LambdaHandlers } from "./handlers-list";
import { SpeechHandler } from "./handlers/speech/speech.handler";

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.SpeechHandler]: (e) => new SpeechHandler(e).respond(),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
