import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";
import { CDPSessionClient } from "../../../page-rendering/cdp/cdp-session-client";

export class ResponseStatus extends BaseMetricContainer {
  constructor(protected page: Page, protected response: Response | null, protected cdp: CDPSessionClient) {
    super(page, response, cdp);
  }

  public columns = [{ name: MetricNames.Status, type: Schema.INTEGER, isGlueColumn: true }];

  public async getMetrics(): Promise<Record<string, number>[]> {
    return [{ [this.columns[0].name]: this.response!.status() }];
  }
}
