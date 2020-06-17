import { Page, Response } from "puppeteer-core";

import { Type } from "@aws-cdk/aws-glue";

import { MetricNames } from "../metrics-list";
import { CDPSessionClient } from "../../page-rendering/cdp/cdp-session-client";

interface IMetricColumn {
  name: MetricNames;
  type: Type;
  isGlueColumn: boolean;
}

export abstract class BaseMetricContainer {
  public abstract columns?: IMetricColumn[];
  constructor(protected page: Page, protected response: Response | null, protected cdpSession: CDPSessionClient) {}
  public abstract getMetrics(): Promise<Record<MetricNames, any>[]>;
}
