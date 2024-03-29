import { envVars } from "./envars.enum";

const isStringAndNotEmpty = (v: any) => {
  if (typeof v !== "string" || v.length < 1) {
    throw new Error(`required and can not be empty string`);
  }
};

export const appConfigSchema = {
  [envVars.region]: {
    doc: "AWS Region of the app",
    format: isStringAndNotEmpty,
    default: "",
    env: "region"
  },
  [envVars.account]: {
    doc: "AWS accountId",
    format: isStringAndNotEmpty,
    default: "",
    env: "account"
  },
  [envVars.crawlUrlsTableName]: {
    doc: "Dynamodb table name for storing crawl URLs",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.crawlUrlsTableName
  },
  [envVars.sitemapUrlsTableName]: {
    doc: "Dynamodb table name for sotring sitemap root nodes",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.sitemapUrlsTableName
  },
  [envVars.isLocal]: {
    doc: "Whether process is on local device",
    format: Boolean,
    default: false,
    env: envVars.isLocal
  },
  [envVars.crawlDataDeliveryStreamName]: {
    doc: "Stream name for delivering crawl data to s3",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.crawlDataDeliveryStreamName
  },
  [envVars.crawlDataBucketName]: {
    doc: "S3 Bucket for Crawl data",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.crawlDataBucketName
  },
  [envVars.chromeClusterDns]: {
    doc: "Websocket URL for chrome cluster",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.chromeClusterDns
  },
  [envVars.chromeClusterPort]: {
    doc: "Websocket PORT for chrome cluster",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.chromeClusterPort
  },
  [envVars.deliveryStreamDbName]: {
    doc: "Glue database name for deliverying metrics",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.deliveryStreamDbName
  },
  [envVars.deliveryStreamCatalogId]: {
    doc: "Glue database catalog id for deliverying metrics",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.deliveryStreamCatalogId
  },
  [envVars.deliveryStreamMetricsTableName]: {
    doc: "Glue database table for storing metrics schema",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.deliveryStreamMetricsTableName
  },
  [envVars.customMetricsTableName]: {
    doc: "DynamoDb table for storing custom metrics",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.customMetricsTableName
  }
};
