import { DynamoStore, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/config.service";
import moment from "moment";

@Model({ tableName: appConfig.urlsTableName })
export class CrawlUrl {
  @PartitionKey()
  public url!: string;
  public level: number = 0;
  public ttl? = moment().add(1, "days").unix().toString(); // FIXME
}

export const crawlUrlStore = new DynamoStore(CrawlUrl);
