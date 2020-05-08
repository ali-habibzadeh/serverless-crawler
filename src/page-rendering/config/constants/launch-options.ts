import chromium from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

export class BrowserService {
  public static browser: Browser;

  public static async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        userDataDir: "user-data",
        headless: chromium.headless,
        executablePath: await chromium.executablePath,
      });
    }
    return this.browser;
  }
}
