import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { LambdaHandlers } from "./handlers-list";
import { TextToSpeechHandler } from "./handlers/text2S/text2S.handler";

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.text2SHandler]: (e) => new TextToSpeechHandler(e).respond(),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
