import type { Session, SortOrder } from '../../types';

/**
 * Filters and sorts sessions based on query and sort order
 * @param sessions - Array of sessions to process
 * @param query - Search query (case-insensitive)
 * @param sortOrder - Sort order for popularity ('asc' or 'desc')
 * @returns Filtered and sorted array of sessions
 */
export const filterAndSortSessions = (
  sessions: Session[],
  query: string,
  sortOrder: SortOrder
): Session[] => {
  // Create a copy to avoid mutating the original array
  let result = [...sessions];

  // 1. Filter by title (case-insensitive)
  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    const lowerQuery = trimmedQuery.toLowerCase();
    result = result.filter(session => 
      session.title.toLowerCase().includes(lowerQuery)
    );
  }

  // 2. Sort (stable sort)
  result.sort((a, b) => {
    // Primary sort: Popularity
    const popularityDiff = a.popularity - b.popularity;
    if (popularityDiff !== 0) {
      return sortOrder === 'asc' ? popularityDiff : -popularityDiff;
    }
    // Secondary sort: ID (for stable sorting)
    return a.id.localeCompare(b.id);
  });

  return result;
};