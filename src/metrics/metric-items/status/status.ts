import { camelCase } from "lodash";
import { Page, Response } from "puppeteer";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetric } from "../../base-types/base-metric";
import { IMetricValue } from "../../base-types/metric.interface";

export class ResponseStatus extends BaseMetric {
  public columnName = "status";
  public schemaType = Schema.INTEGER;
  public isGlueColumn = true;

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetricValue(): Promise<IMetricValue<number>> {
    return {
      name: camelCase(ResponseStatus.name),
      value: this.response!.status(),
      parquetType: Schema.INTEGER,
    };
  }
}
