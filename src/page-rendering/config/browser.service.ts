import chromium from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

export class BrowserService {
  public static browser: Browser;

  public static async createBrowser(): Promise<Browser> {
    if (!this.browser) {
      console.log("called createBrowser once");
      this.browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        userDataDir: "user-data",
        headless: chromium.headless,
        executablePath: await chromium.executablePath,
      });
    }
    console.log("called createBrowser again");
    return this.browser;
  }
}
