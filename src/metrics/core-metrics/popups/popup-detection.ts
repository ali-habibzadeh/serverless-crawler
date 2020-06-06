// tslint:disable-next-line: no-big-function
export function hasPopup(): boolean {
  const getFixedElements = () => {
    return [...document.querySelectorAll("*")].filter(el => {
      const styles = getComputedStyle(el);
      return styles.position !== "static" && styles.position !== "relative" && styles.height !== "auto";
    });
  };

  const hasElementsCoveringPage = () => {
    const fixedElements = getFixedElements();
    return (
      fixedElements.slice(Math.max(fixedElements.length - 20, 1)).filter(el => {
        const styles = getComputedStyle(el);
        return parseInt(styles.height, 10) === document.body.clientHeight;
      }).length !== 0
    );
  };

  const isScrollBlocked = () => {
    return (
      [...document.querySelectorAll("body, html")].find(el => getComputedStyle(el).overflowY !== "visible") !==
      undefined
    );
  };

  return isScrollBlocked() || hasElementsCoveringPage();
}
