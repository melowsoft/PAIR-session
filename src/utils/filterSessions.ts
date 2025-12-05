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

  let result = [...sessions];

  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    result = result.filter(session => 
      session.title.toLowerCase().includes(lowerQuery)
    );
  }

  result.sort((a, b) => {
    const popularityDiff = a.popularity - b.popularity;
    if (popularityDiff !== 0) {
      return sortOrder === 'asc' ? popularityDiff : -popularityDiff;
    }
    return a.id.localeCompare(b.id);
  });

  return result;
};