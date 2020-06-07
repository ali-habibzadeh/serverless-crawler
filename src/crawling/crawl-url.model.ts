import { DynamoStore, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../config/config.service";
import moment from "moment";

@Model({ tableName: appConfig.urlsTableName })
export class CrawlUrl {
  @PartitionKey()
  public url!: string;
  public level!: number;
  public ttl?: string = moment().add(12, "hours").unix().toString();
}

export const crawlUrlStore = new DynamoStore(CrawlUrl);
