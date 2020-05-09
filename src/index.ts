import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { StartCrawlHandler } from "./crawling/start-crawl.handler";
import { StreamProcessorHandler } from "./crawling/stream-processor.handler";
import { LambdaHandlers } from "./handlers-list";

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.StreamProcessorHandler]: (e) => new StreamProcessorHandler(e).handle(),
  [LambdaHandlers.StartCrawlHandler]: (e) => new StartCrawlHandler(e).handle(),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
