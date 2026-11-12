import { getBackendOrigin } from "../api/api-client";

export const DEFAULT_NATURE_IMAGE =
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80";

export const SAMPLE_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
];

/**
 * Normalizes an image path or URL into an absolute URL accessible by the browser.
 * If the path is relative (e.g. `/uploads/trees/...`), prepends the backend host.
 */
export function getMediaUrl(
  pathOrUrl?: string | null,
  fallback: string = DEFAULT_NATURE_IMAGE
): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string") {
    return fallback;
  }
  const clean = pathOrUrl.trim();
  if (!clean) return fallback;

  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return clean;
  }

  // Prepend backend server origin
  const backendOrigin = getBackendOrigin();

  const normalizedPath = clean.startsWith("/") ? clean : `/${clean}`;
  return `${backendOrigin}${normalizedPath}`;
}

/**
 * Seamlessly replaces broken/failed image tags with a curated lush living forest photograph.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string = DEFAULT_NATURE_IMAGE
): void {
  const target = event.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
