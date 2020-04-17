import { LambdaHandlers } from "./handlers-list";
import { LambdaHandlerFactory } from "./infrastructure/utils/lambda-handler.factory";

const handlers = {
  [LambdaHandlers.alexaHandler]: async (arg: any) => JSON.stringify(arg),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
