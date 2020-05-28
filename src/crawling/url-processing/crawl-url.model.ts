import { DynamoStore, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/config.service";
import moment from "moment";

@Model({ tableName: appConfig.urlsTableName })
export class CrawlUrl {
  @PartitionKey()
  public url!: string;
  public level: number = 0;
  public ttl?: string = moment().add(2, "minutes").unix().toString();
}

export const crawlUrlStore = new DynamoStore(CrawlUrl);
