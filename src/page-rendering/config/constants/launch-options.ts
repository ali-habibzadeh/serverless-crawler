import chromium from "chrome-aws-lambda";
import { LaunchOptions } from "puppeteer-core";

export class LaunchOptionsService {
  public static options: LaunchOptions;

  public static async getOptions(): Promise<LaunchOptions> {
    if (!this.options) {
      this.options = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        userDataDir: "user-data",
        headless: chromium.headless,
        executablePath: await chromium.executablePath,
      };
    }
    return this.options;
  }
}
