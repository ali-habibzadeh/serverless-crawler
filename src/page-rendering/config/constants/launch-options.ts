import chromium from "chrome-aws-lambda";
import { LaunchOptions } from "puppeteer-core";

import { chromiumSwitches } from "./chrome-switches";

export async function getLaunchOptions(): Promise<LaunchOptions> {
  return {
    args: chromiumSwitches,
    userDataDir: "user-data",
    headless: true,
    executablePath: await chromium.executablePath,
  };
}
