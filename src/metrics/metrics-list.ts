import { Column } from "@aws-cdk/aws-glue";

import { InternalLinks } from "./metric-containers/internal-links/internal-links";
import { WebPerformance } from "./metric-containers/performance/performance";
import { ResponseStatus } from "./metric-containers/status/status";
import { PageUrl } from "./metric-containers/url/page-url";
import { PageHtml } from "./metric-containers/html/page-html";
import { Indexation } from "./metric-containers/indexation/indexation";
import { Responsive } from "./metric-containers/responsive/responsive";
import { Robots } from "./metric-containers/robots/robots";
import { RedirectChain } from "./metric-containers/redirect-chain/redirect-chain";
import { Popups } from "./metric-containers/popups/popups";

export enum MetricNames {
  Url = "url",
  Status = "status",
  InternalLinks = "internal_links",
  FirstContentfulPaint = "first_contentful_paint",
  LargestContentfulPaint = "largest_contetnful_paint",
  PageResourcesCount = "page_resources_count",
  PreRenderDom = "pre_render_dom",
  PostRenderDom = "post_redner_dom",
  NoIndex = "no_index",
  IsResponsive = "is_responsive",
  IsAllowedByRobots = "is_allowed_by_robots",
  RedirectChain = "redirect_chain",
  HasPopup = "has_popup"
}

export const metricsContainers = [
  PageUrl,
  InternalLinks,
  ResponseStatus,
  WebPerformance,
  PageHtml,
  Indexation,
  Responsive,
  Robots,
  Popups,
  RedirectChain
];

export function getGlueColumns(): Column[] {
  return metricsContainers
    .map(metric => Reflect.construct(metric, []).columns)
    .flat()
    .filter(col => col.isGlueColumn)
    .map(col => ({ name: col.name, type: col.type }));
}
