import axios from "axios";
import { run } from "../../../utils/child-process";
import { makeDir, has, write } from "../../../utils/file-system";

export class RobotsTxt {
  private url = new URL(this.href);
  private folderLocation = `/tmp/${this.url.host}`;
  private robotsLocation = `${this.folderLocation}/robots.txt`;
  constructor(private href: string) {
    process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
  }

  public async isAllowed(): Promise<boolean> {
    if (!(await this.alreadyExists())) {
      const robotstxt = await this.getRobotsFile();
      if (!robotstxt) {
        return true;
      }
      await this.writeRobots(robotstxt);
    }
    return this.getBinaryAllowedResults();
  }

  private async getBinaryAllowedResults(): Promise<boolean> {
    const { stdout } = await run(`robots ${this.robotsLocation} GoogleBot ${this.url.href}`);
    return !stdout.includes("DISALLOWED");
  }

  private async writeRobots(robotstxt: string): Promise<void> {
    await makeDir(this.folderLocation, { recursive: true });
    return write(this.robotsLocation, robotstxt);
  }

  private async alreadyExists(): Promise<boolean> {
    return has(this.robotsLocation);
  }

  private async getRobotsFile(): Promise<string | undefined> {
    try {
      const { data } = await axios.get(`${this.url.origin}/robots.txt`);
      return data;
    } catch (e) {
      return;
    }
  }
}
