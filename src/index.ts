import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { StartCrawlHandler } from "./crawling/start-crawl.handler";
import { StreamProcessorHandler } from "./crawling/stream-processor.handler";
import { LambdaHandlers } from "./handlers-list";

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.StreamProcessorHandler]: (e, c) => new StreamProcessorHandler(e, c).handle(),
  [LambdaHandlers.StartCrawlHandler]: (e, c) => new StartCrawlHandler(e, c).handle(),
};

module.exports = handlers;
