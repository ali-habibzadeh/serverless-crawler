import { Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/config.service";

@Model({ tableName: appConfig.customMetricsTableName })
export class CustomMetric {
  @PartitionKey()
  public id!: string;
  public fn!: string;
  public type!: string;
}
