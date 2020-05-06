import { Column } from "@aws-cdk/aws-glue";

import { InternalLinks } from "./metric-items/internal-links/internal-links";
import { ResponseStatus } from "./metric-items/status/status";
import { PageUrl } from "./metric-items/url/page-url";

export enum MetricNames {
  Url = "url",
  Status = "status",
  InternalLinks = "internal_links",
}

export const metricsList = [PageUrl, InternalLinks, ResponseStatus];

export function getGlueColumns(): Column[] {
  return metricsList
    .map((metric) => Reflect.construct(metric, []).columns)
    .flat()
    .filter((col) => col.isGlueColumn)
    .map((col) => ({ name: col.name, type: col.type }));
}
