export async function getLargestContentfulPaint(): Promise<number> {
  return new Promise((resolve) => {
    const po = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries.find((entry) => entry.entryType === "largest-contentful-paint");
      if (lcpEntry) {
        resolve(Math.round(lcpEntry.startTime));
      }
      po.observe({ type: "largest-contentful-paint", buffered: true });
    });
  });
}
