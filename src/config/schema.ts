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
};
