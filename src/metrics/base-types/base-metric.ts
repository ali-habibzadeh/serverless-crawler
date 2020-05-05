import { camelCase, isArray } from "lodash";
import { Page, Response } from "puppeteer-core";

import { Type } from "@aws-cdk/aws-glue";

import { IMetric, IMetricValue } from "./metric.interface";

export abstract class BaseMetric {
  public abstract columnName: string;
  public abstract schemaType: Type;
  public abstract isGlueColumn: boolean;

  constructor(protected page: Page, protected response: Response | null) {}

  public async getMetric(): Promise<IMetric<any>> {
    const { name, value, parquetType } = await this.getMetricValue();
    const { name: jsTypeName, isArray } = this.getDataType(value);
    return {
      value,
      isArray,
      parquetType,
      jsType: jsTypeName,
      name: camelCase(name),
    };
  }

  private getDataType(metricValue: any): { name: string; isArray: boolean } {
    const isCollection = isArray(metricValue);
    const singleItem = isCollection ? metricValue[0] : metricValue;
    const toBeDetermined = singleItem ? singleItem : {};
    return {
      isArray: isCollection,
      name: typeof toBeDetermined,
    };
  }

  public abstract getMetricValue(): Promise<IMetricValue<any>>;
}
