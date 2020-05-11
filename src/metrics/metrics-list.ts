import { Column } from "@aws-cdk/aws-glue";

import { InternalLinks } from "./metric-items/internal-links/internal-links";
import { WebPerformance } from "./metric-items/performance/performance";
import { ResponseStatus } from "./metric-items/status/status";
import { PageUrl } from "./metric-items/url/page-url";

export enum MetricNames {
  Url = "url",
  Status = "status",
  InternalLinks = "internal_links",
  FCP = "first_contentful_paint",
  PageResourcesCount = "page_resources_count",
}

export const metricsContainers = [PageUrl, InternalLinks, ResponseStatus];

export function getGlueColumns(): Column[] {
  return metricsContainers
    .map((metric) => Reflect.construct(metric, []).columns)
    .flat()
    .filter((col) => col.isGlueColumn)
    .map((col) => ({ name: col.name, type: col.type }));
}
