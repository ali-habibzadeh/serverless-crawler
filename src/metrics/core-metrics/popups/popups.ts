import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";
import { hasPopup } from "./popup-detection";
import { CDPSessionClient } from "../../../page-rendering/cdp/cdp-session-client";

export class Popups extends BaseMetricContainer {
  constructor(protected page: Page, response: Response | null, protected cdp: CDPSessionClient) {
    super(page, response, cdp);
  }

  public columns = [{ name: MetricNames.HasPopup, type: Schema.BOOLEAN, isGlueColumn: true }];

  public async getMetrics(): Promise<Record<string, boolean>[]> {
    return [{ [this.columns[0].name]: await this.hasPopup() }];
  }

  private async hasPopup(): Promise<boolean> {
    return this.page.evaluate(hasPopup);
  }
}
