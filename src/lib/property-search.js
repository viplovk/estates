export const SEARCH_KEYS = [
  "transaction",
  "bucket",
  "category",
  "locality",
  "minPrice",
  "maxPrice",
  "bedrooms",
  "bathrooms",
  "minArea",
  "maxArea",
  "furnishing",
  "parking",
  "floor",
  "availability",
  "sort",
];

/** Keeps only known search params as plain strings, so the URL stays tidy. */
export function validatePropertySearch(search = {}) {
  const out = {};
  for (const key of SEARCH_KEYS) {
    const value = search[key];
    if (value === undefined || value === null || value === "") continue;
    out[key] = String(value);
  }
  return out;
}

export function countActiveFilters(search = {}) {
  return Object.keys(search).filter((k) => k !== "sort" && k !== "transaction").length;
}