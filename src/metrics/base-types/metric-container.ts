import { Page, Response } from "puppeteer-core";

import { Type } from "@aws-cdk/aws-glue";

import { MetricNames } from "../metrics-list";

export interface IMetricColumn {
  name: MetricNames;
  type: Type;
  isGlueColumn: boolean;
}

export abstract class MetricContainer {
  public abstract columns: IMetricColumn[];

  constructor(protected page: Page, protected response: Response | null) {}

  public abstract getMetrics(): Promise<Record<MetricNames, any>[]>;
}
