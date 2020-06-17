import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";
import { RobotsChecker } from "./robots-checker";

export class Robots extends BaseMetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [{ name: MetricNames.IsAllowedByRobots, type: Schema.BOOLEAN, isGlueColumn: true }];

  public async getMetrics(): Promise<Record<string, boolean>[]> {
    return [{ [this.columns[0].name]: await this.isAlloed() }];
  }

  private async isAlloed(): Promise<boolean> {
    return RobotsChecker.getInstance().isAllowed(this.page.url());
  }
}
