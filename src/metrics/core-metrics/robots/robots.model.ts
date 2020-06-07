import axios from "axios";
import { run } from "../../../utils/child-process";
import { makeDir, write } from "../../../utils/file-system";

interface IWebsiteItem {
  hasRobots: boolean;
  alreadyStored?: boolean;
  data?: string;
}

export class RobotsChecker {
  private static instance: RobotsChecker;
  private static robotsMap = new Map<string, IWebsiteItem>();

  private constructor() {}

  public static getInstance(): RobotsChecker {
    if (!RobotsChecker.instance) {
      process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
      RobotsChecker.instance = new RobotsChecker();
    }
    return RobotsChecker.instance;
  }

  public async isAllowed(href: string, bot = "GoogleBot"): Promise<boolean> {
    const url = new URL(href);
    const match = RobotsChecker.robotsMap.get(url.host);
    if (match && !match.hasRobots) {
      return true;
    }
    if (match && match.alreadyStored) {
      return RobotsChecker.getBinaryIsAllowed(url, bot);
    }
    await RobotsChecker.addToMap(url);
    return RobotsChecker.getBinaryIsAllowed(url, bot);
  }

  private static async addToMap(url: URL): Promise<void> {
    try {
      const { data } = await axios.get(`${url.origin}/robots.txt`);
      await this.writeRobots(url, data);
      this.robotsMap.set(url.host, { data, hasRobots: true, alreadyStored: true });
    } catch {
      this.robotsMap.set(url.host, { hasRobots: false });
    }
  }

  private static async writeRobots(url: URL, robotstxt: string): Promise<void> {
    await makeDir(`/tmp/${url.host}`, { recursive: true });
    return write(`/tmp/${url.host}/robots.txt`, robotstxt);
  }

  private static async getBinaryIsAllowed(url: URL, bot = "GoogleBot"): Promise<boolean> {
    const { stdout } = await run(`robots /tmp/${url.host}/robots.txt ${bot} ${url.href}`);
    return !stdout.includes("DISALLOWED");
  }
}
