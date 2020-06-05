import axios from "axios";
import { run } from "../../../utils/child-process";
import { makeDir, has, write } from "../../../utils/file-system";
import flatCache from "flat-cache";

export class RobotsTxt {
  private url = new URL(this.href);
  private cache = flatCache.load("robotsRequestCache", "/tmp");
  private folderLocation = `/tmp/${this.url.host}`;
  private robotsLocation = `${this.folderLocation}/robots.txt`;
  constructor(private href: string, private bot = "GoogleBot") {
    process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
  }

  public async isAllowed(): Promise<boolean> {
    if (!(await has(this.robotsLocation))) {
      const robotstxt = await this.getRobots();
      if (!robotstxt) {
        return true;
      }
      await this.writeRobots(robotstxt);
    }
    return this.getBinaryIsAllowed();
  }

  private async getBinaryIsAllowed(): Promise<boolean> {
    const { stdout } = await run(`robots ${this.robotsLocation} ${this.bot} ${this.url.href}`);
    return !stdout.includes("DISALLOWED");
  }

  private async writeRobots(robotstxt: string): Promise<void> {
    await makeDir(this.folderLocation, { recursive: true });
    return write(this.robotsLocation, robotstxt);
  }

  private async getRobots(): Promise<string | undefined> {
    if (this.hasNoRobots()) {
      return;
    }
    try {
      const { data } = await axios.get(`${this.url.origin}/robots.txt`);
      return data;
    } catch (e) {
      this.cache.setKey(this.url.host, "no-robots");
      this.cache.save();
      return;
    }
  }

  private hasNoRobots(): boolean {
    return this.cache.getKey(this.url.host) === "no-robots";
  }
}
