import { BaseQualifier } from "../base-qualifier";
import { write, makeDir } from "../../../../utils/file-system";
import { run } from "../../../../utils/child-process";
import axios from "axios";

export class RobotsQualifier extends BaseQualifier {
  constructor() {
    super();
    process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
  }

  // tslint:disable-next-line: no-feature-envy
  protected async isQualified(href: string): Promise<boolean> {
    const url = new URL(href);
    const robotsLocation = `/tmp/${url.host}/robots.txt`;
    await makeDir(`/tmp/${url.host}`, { recursive: true });
    await write(robotsLocation, await axios.get(`${url.origin}/robots.txt`));
    const { stdout } = await run(`robots ${robotsLocation} GoogleBot ${url.href}`);
    return !stdout.includes("DISALLOWED");
  }
}
