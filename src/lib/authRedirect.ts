// Resolves a safe same-origin relative path from the ?next= query parameter.
export const getNextPath = (fallback = "/dashboard"): string => {
  try {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  } catch {
    // ignore malformed URLs
  }
  return fallback;
};

export const getNextUrl = (fallback = "/dashboard"): string =>
  `${window.location.origin}${getNextPath(fallback)}`;
