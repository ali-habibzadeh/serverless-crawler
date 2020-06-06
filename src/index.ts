import "reflect-metadata";
import "./utils/axios-cache";
import AWS from "aws-sdk";

import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { appConfig } from "./config/config.service";
import { StartCrawlHandler } from "./crawling/handlers/start-crawl.handler";
import { StreamProcessorHandler } from "./crawling/handlers/stream-processor.handler";
import { LambdaHandlers } from "./handlers-list";
import { UpdateMetricsHandler } from "./metrics/handlers/update-metrics.handler";

AWS.config.update({ region: appConfig.region });

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.StreamProcessorHandler]: e => new StreamProcessorHandler(e).handle(),
  [LambdaHandlers.StartCrawlHandler]: e => new StartCrawlHandler(e).handle(),
  [LambdaHandlers.UpdateMetricsHandler]: e => new UpdateMetricsHandler(e).handle()
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
