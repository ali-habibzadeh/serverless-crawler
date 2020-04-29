import { hashKey, table } from "@aws/dynamodb-data-mapper-annotations";

import { envVars } from "../../config/envars.enum";

@table(envVars.crawlUrlsTableName)
export class CrawlUrl {
  @hashKey()
  public url!: string;
}
