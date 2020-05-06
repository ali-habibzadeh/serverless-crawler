import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { MetricContainer } from "../../base-types/metric-container";
import { MetricNames } from "../../metrics-list";

export class ResponseStatus extends MetricContainer {
  public columns = [{ name: MetricNames.Status, type: Schema.STRING, isGlueColumn: true }];

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetrics(): Promise<Record<string, number>[]> {
    return [
      {
        [this.columns[0].name]: this.response!.status(),
      },
    ];
  }
}
