import { write, makeDir, has } from "../../../../utils/file-system";
import { run } from "../../../../utils/child-process";
import axios from "axios";

export class RobotsTxt {
  private url = new URL(this.href);
  private folderLocation = `/tmp/${this.url.host}`;
  private robotsLocation = `${this.folderLocation}/robots.txt`;
  constructor(private href: string) {}

  public async isAllowed(): Promise<boolean> {
    if (!(await this.alreadyExists())) {
      await this.write();
    }
    const { stdout } = await run(`robots ${this.robotsLocation} GoogleBot ${this.url.href}`);
    return !stdout.includes("DISALLOWED");
  }

  private async alreadyExists(): Promise<boolean> {
    return has(this.robotsLocation);
  }

  private async write(): Promise<void> {
    await makeDir(`/tmp/${this.url.host}`, { recursive: true });
    await write(this.robotsLocation, await axios.get(`${this.url.origin}/robots.txt`));
  }
}
