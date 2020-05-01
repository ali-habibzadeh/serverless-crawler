import { envVars } from "./envars.enum";

export const appConfigSchema = {
  region: {
    doc: "AWS Region of the app",
    format: String,
    default: "us-east-1",
    env: "region",
  },
  account: {
    doc: "AWS accountId",
    format: String,
    default: "1234s",
    env: "account",
  },
  [envVars.crawlUrlsTableName]: {
    doc: "Dynamodb table name for sotring crawl URLs",
    format: String,
    default: "urlsTable",
    env: envVars.crawlUrlsTableName,
  },
  [envVars.isLocal]: {
    doc: "Whether process is on local device",
    format: Boolean,
    default: false,
    env: envVars.isLocal,
  },
};
