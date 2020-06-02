import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";

export class Responsive extends BaseMetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [{ name: MetricNames.IsResponsive, type: Schema.BOOLEAN, isGlueColumn: true }];

  public async getMetrics(): Promise<Record<string, any>[]> {
    return [{ [this.columns[0].name]: await this.isResponsive() }];
  }

  private isResponsive(): Promise<boolean> {
    const assertion = () => document.querySelector(`meta[name="viewport"][content*="width=device-width`) !== undefined;
    return this.page.evaluate(assertion);
  }
}
