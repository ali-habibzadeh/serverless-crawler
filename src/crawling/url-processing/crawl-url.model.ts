import { hashKey, table } from "@aws/dynamodb-data-mapper-annotations";

import { appConfig } from "../../config/config.service";

@table(appConfig.urlsTableName)
export class CrawlUrl {
  @hashKey()
  public url!: string;
  public level!: number;
}
