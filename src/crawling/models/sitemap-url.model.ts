import { DynamoStore, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/config.service";
import moment from "moment";

@Model({ tableName: appConfig.sitemapUrlsTableName })
export class SitemaplUrl {
  @PartitionKey()
  public url!: string;
  public ttl?: string = moment().add(12, "hours").unix().toString();
}

export const sitemapUrlStore = new DynamoStore(SitemaplUrl);
