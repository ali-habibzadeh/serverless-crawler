export async function getLargestContentfulPaint(): Promise<number> {
  return new Promise((resolve) => {
    const po = new PerformanceObserver((list) => {
      const lcpEntry = list.getEntries().find((e) => e.entryType === "largest-contentful-paint");
      if (lcpEntry) {
        resolve(Math.round(lcpEntry.startTime));
      }
      po.observe({ type: "largest-contentful-paint", buffered: true });
    });
  });
}
