import { envVars } from "./envars.enum";
import { SchemaObj } from "convict";

const isStringAndNotEmpty = (v: any) => {
  if (typeof v !== "string" || v.length < 1) {
    throw new Error(`required and can not be empty string`);
  }
};

export const appConfigSchema: Record<envVars, SchemaObj<any>> = {
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
    doc: "Dynamodb table name for sotring crawl URLs",
    format: isStringAndNotEmpty,
    default: "",
    env: envVars.crawlUrlsTableName
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
  }
};
