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
  [envVars.speechBucketName]: {
    doc: "S3 Bucket name for speech",
    format: String,
    default: "1234s",
    env: envVars.speechBucketName,
  },
};
