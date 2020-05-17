interface ILinkData {
  attrHref: string | null;
  href: string;
}

export const isNormalLink = (link: ILinkData): boolean => {
  const href = link.attrHref || "";
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return href !== "";
  }
};

export const getNormalLinks = (linksData: ILinkData[]): string[] => {
  const normalLinks = linksData.filter(isNormalLink).map((link) => link.href);
  return [...new Set(normalLinks)];
};
