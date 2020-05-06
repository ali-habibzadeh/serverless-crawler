import chromium from "chrome-aws-lambda";
import { LaunchOptions } from "puppeteer";

import { appConfig } from "../../../config/config.service";

export async function getLaunchOptions(): Promise<LaunchOptions> {
  return {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    userDataDir: "user-data",
    headless: chromium.headless,
    ...(!appConfig.isLocal && { executablePath: await chromium.executablePath }),
  };
}
