import { Schema } from "@aws-cdk/aws-glue";

export interface IMetricValue<T> {
  /**
   * Name of the metric
   */
  name: string;
  /**
   * Value of the metric
   */
  value: T;
  /**
   * Name of the data type of this metric for Parquet
   */
  parquetType: Schema;
}

export interface IMetric<T> extends IMetricValue<T> {
  /**
   * Name of the data type of this metric within JS
   */
  jsType: string;
  /**
   * Whether the value is an array or not
   */
  isArray?: boolean;
}
