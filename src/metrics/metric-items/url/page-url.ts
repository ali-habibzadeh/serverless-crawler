import { Page, Response } from "puppeteer";

import { Schema } from "@aws-cdk/aws-glue";

import { MetricContainer } from "../../base-types/metric-container";
import { MetricNames } from "../../metrics-list";

export class PageUrl extends MetricContainer {
  public columns = [{ name: MetricNames.Url, type: Schema.STRING, isGlueColumn: true }];

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetric(): Promise<Record<string, any>[]> {
    return [
      {
        [this.columns[0].name]: this.page.url(),
      },
    ];
  }
}
