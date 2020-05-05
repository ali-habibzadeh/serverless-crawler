import { camelCase } from "lodash";
import { Page, Response } from "puppeteer";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetric } from "../../base-types/base-metric";
import { IMetricValue } from "../../base-types/metric.interface";

export class PageUrl extends BaseMetric {
  public columnName = "url";
  public schemaType = Schema.STRING;
  public isGlueColumn = true;

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetricValue(): Promise<IMetricValue<string>> {
    return {
      name: camelCase(PageUrl.name),
      value: this.page.url(),
      parquetType: Schema.INTEGER,
    };
  }
}
