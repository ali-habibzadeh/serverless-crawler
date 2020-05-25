import { BaseQualifier } from "../base-qualifier";
import { RobotsTxt } from "./robots.model";

export class RobotsQualifier extends BaseQualifier {
  constructor() {
    super();
    process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
  }

  protected async isQualified(href: string): Promise<boolean> {
    return new RobotsTxt(href).isAllowed();
  }
}
