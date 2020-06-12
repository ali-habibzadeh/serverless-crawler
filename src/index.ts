import "reflect-metadata";
import AWS from "aws-sdk";
import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

import { PublicFn } from "./@infrastructure/utils/interfaces/lambda-handler.interface";
import { LambdaHandlerFactory } from "./@infrastructure/utils/lambda-handler.factory";
import { appConfig } from "./config/config.service";
import { StartCrawlHandler } from "./crawling/handlers/start-crawl.handler";
import { StreamProcessorHandler } from "./crawling/handlers/stream-processor.handler";
import { LambdaHandlers } from "./handlers-list";
import { CustomMetricsHandler } from "./metrics/handlers/custom-metrics.handler";
import { QueryTesterHandler } from "./metrics/handlers/query-tester.handler";

AWS.config.update({ region: appConfig.region });

const handlers: Record<LambdaHandlers, PublicFn> = {
  [LambdaHandlers.StreamProcessorHandler]: e => new StreamProcessorHandler(e).handle(),
  [LambdaHandlers.StartCrawlHandler]: e => new StartCrawlHandler(e).handle(),
  [LambdaHandlers.CustomMetricsHandler]: e => new CustomMetricsHandler(e).handle(),
  [LambdaHandlers.QueryTesterHandler]: e => new QueryTesterHandler(e).handle()
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
