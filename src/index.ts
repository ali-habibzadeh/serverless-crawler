import AWS, { Lambda } from "aws-sdk";

import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { appConfig } from "./config/config.service";
import { StartCrawlHandler } from "./crawling/start-crawl.handler";
import { StreamProcessorHandler } from "./crawling/stream-processor.handler";
import { LambdaHandlers } from "./handlers-list";
import { ListFunctionsResponse } from "aws-sdk/clients/lambda";

AWS.config.update({ region: appConfig.region });

async function listFunctions(_e: any): Promise<ListFunctionsResponse> {
  const lambda = new Lambda();
  return lambda.listFunctions({}).promise();
}

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.StreamProcessorHandler]: (e) => new StreamProcessorHandler(e).handle(),
  [LambdaHandlers.StartCrawlHandler]: (e) => new StartCrawlHandler(e).handle(),
  [LambdaHandlers.ListFunctionsHandler]: (e) => listFunctions(e)
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
