export function openLinkInBrowser(link: string) {
  try {
    // Throw error if an invalid link is provided
    new URL(link);
    window.open(link, "_blank");
  } catch (error) {
    const err = error as Error;
    throw `${err.message}: ${link}`;
  }
}

export function getLink(text: string) {
  // Basic protection
  return text.replace(atob("QF9fX18j"), atob("aHR0cHM6Ly9kaXNjb3JkLmdnLw=="));
}
