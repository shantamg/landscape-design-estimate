import type { CatalogItem, CatalogType } from "@/types";

const MAX_RESULTS = 20;

/**
 * Filter catalog items by query string and optional type.
 * Simple substring matching on name, description, and tags.
 * Results are grouped by category and limited to MAX_RESULTS.
 */
export function filterCatalog(
  items: CatalogItem[],
  query: string,
  type?: CatalogType
): CatalogItem[] {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();

  let filtered = items;

  // Filter by type if specified
  if (type) {
    filtered = filtered.filter((item) => item.type === type);
  }

  // Match against name, description, and tags
  const matched = filtered.filter((item) => {
    const searchableText = [
      item.name,
      item.description,
      ...item.tags,
    ]
      .join(" ")
      .toLowerCase();

    return normalizedQuery.split(/\s+/).every((word) =>
      searchableText.includes(word)
    );
  });

  // Sort: exact name matches first, then by name alphabetically
  matched.sort((a, b) => {
    const aNameLower = a.name.toLowerCase();
    const bNameLower = b.name.toLowerCase();
    const aStartsWith = aNameLower.startsWith(normalizedQuery);
    const bStartsWith = bNameLower.startsWith(normalizedQuery);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return aNameLower.localeCompare(bNameLower);
  });

  return matched.slice(0, MAX_RESULTS);
}
