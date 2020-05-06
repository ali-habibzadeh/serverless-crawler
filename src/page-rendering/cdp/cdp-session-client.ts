import CDP from "devtools-protocol/types/protocol";
import { CDPSession, Page } from "puppeteer";

export class CDPSessionClient {
  private client!: CDPSession;
  constructor(private page: Page) {}

  public async getEventListeners(nodeId: number): Promise<CDP.DOMDebugger.EventListener[]> {
    const objectId = await this.resolveNodeObjectId(nodeId);
    const { listeners } = <CDP.DOMDebugger.GetEventListenersResponse>(
      await this.client.send("DOMDebugger.getEventListeners", { objectId })
    );
    return listeners;
  }

  public async startSession(): Promise<void> {
    this.client = await this.page.target().createCDPSession();
  }

  public async enablePerformance(): Promise<void> {
    await this.client.send("Performance.enable");
  }

  public async getPerformanceMetrics(): Promise<CDP.Performance.GetMetricsResponse> {
    return <CDP.Performance.GetMetricsResponse>await this.client.send("Performance.getMetrics");
  }

  public async querySelectorAll(selector: string): Promise<number[]> {
    const doc = await this.getDocument();
    const { nodeIds } = <CDP.DOM.QuerySelectorAllResponse>(
      await this.client.send("DOM.querySelectorAll", { selector, nodeId: doc.root.nodeId })
    );
    return nodeIds;
  }

  public async getPageResourceTree(): Promise<CDP.Page.GetResourceTreeResponse> {
    return <CDP.Page.GetResourceTreeResponse>await this.client.send("Page.getResourceTree");
  }

  public async getDocument(): Promise<CDP.DOM.GetDocumentResponse> {
    return <Promise<CDP.DOM.GetDocumentResponse>>this.client.send("DOM.getDocument");
  }

  public async resolveNodeObjectId(nodeId: number): Promise<string | undefined> {
    const {
      object: { objectId },
    } = <CDP.DOM.ResolveNodeResponse>await this.client.send("DOM.resolveNode", { nodeId });
    return objectId;
  }

  public async getAttribute(nodeId: number, attribute: string): Promise<string | null> {
    const { attributes } = <CDP.DOM.GetAttributesResponse>(
      await this.client.send("DOM.getAttributes", { nodeId })
    );
    const attrIndex = attributes.indexOf(attribute);
    return attrIndex === -1 ? null : attributes[attrIndex + 1];
  }
}
