import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { MetricContainer } from "../../base-types/metric-container";
import { MetricNames } from "../../metrics-list";

export class PageUrl extends MetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [{ name: MetricNames.Url, type: Schema.STRING, isGlueColumn: true }];

  public async getMetrics(): Promise<Record<string, any>[]> {
    return [
      {
        [this.columns[0].name]: this.page.url(),
      },
    ];
  }
}
