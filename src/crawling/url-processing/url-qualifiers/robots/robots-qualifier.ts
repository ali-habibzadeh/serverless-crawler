import { BaseQualifier } from "../base-types/base-qualifier";
import { RobotsTxt } from "../../../../metrics/core-metrics/robots/robots.model";

export class RobotsQualifier extends BaseQualifier {
  constructor() {
    super();
  }

  protected async isQualified(href: string): Promise<boolean> {
    return new RobotsTxt(href).isAllowed();
  }
}
