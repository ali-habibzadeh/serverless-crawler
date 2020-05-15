import { DynamoStore, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/config.service";

@Model({ tableName: appConfig.urlsTableName })
export class CrawlUrl {
  @PartitionKey()
  public url!: string;
  public level: number = 0;
}

export const crawlUrlStore = new DynamoStore(CrawlUrl);
