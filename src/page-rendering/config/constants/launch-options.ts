import chromium from "chrome-aws-lambda";
import { LaunchOptions } from "puppeteer-core";

export async function getLaunchOptions(): Promise<LaunchOptions> {
  try {
    return {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      userDataDir: "user-data",
      headless: chromium.headless,
      executablePath: await chromium.executablePath,
    };
  } catch (e) {
    console.log(e);
    throw new Error(`Error geting LaunchOptions`);
  }
}
