import { DynamoStore, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/config.service";

@Model({ tableName: appConfig.customMetricsTableName })
export class CustomMetric {
  @PartitionKey()
  public id!: string;
  public fn!: string;
}

export const customMetricStore = new DynamoStore(CustomMetric);
