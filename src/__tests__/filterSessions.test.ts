import { filterAndSortSessions } from '../utils/filterSessions';
import type { Session } from '../../types';

const mockSessions: Session[] = [
  { id: 's1', title: 'Prompting 101', tags: ['prompts'], mins: '8', difficulty: 'beginner', popularity: 187, updatedAt: '2025-09-01T10:00:00Z', completed: false },
  { id: 's2', title: 'Advanced Prompting', tags: ['prompts'], mins: '14', difficulty: 'advanced', popularity: 122, updatedAt: '2025-10-12T09:00:00Z', completed: true },
  { id: 's3', title: 'Evaluating Output', tags: ['quality'], mins: '12', difficulty: 'intermediate', popularity: 205, updatedAt: '2025-08-28T17:30:00Z', completed: false },
  { id: 's4', title: 'Vector Search', tags: ['search'], mins: '9', difficulty: null, popularity: 140, updatedAt: '2025-06-11T08:12:00Z', completed: false },
];

describe('filterAndSortSessions', () => {
  test('returns all sessions when query is empty', () => {
    const result = filterAndSortSessions(mockSessions, '', 'desc');
    expect(result).toHaveLength(4);
    expect(result[0].id).toBe('s3'); // Highest popularity (205) first
    expect(result[3].id).toBe('s2'); // Lowest popularity (122) last
  });

  test('filters sessions by title (case-insensitive)', () => {
    const result = filterAndSortSessions(mockSessions, 'prompt', 'desc');
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Prompting 101');
    expect(result[1].title).toBe('Advanced Prompting');
  });

  test('returns empty array when no matches found', () => {
    const result = filterAndSortSessions(mockSessions, 'nonexistent', 'desc');
    expect(result).toHaveLength(0);
  });

  test('sorts by popularity descending by default', () => {
    const result = filterAndSortSessions(mockSessions, '', 'desc');
    expect(result[0].popularity).toBe(205); // Highest
    expect(result[1].popularity).toBe(187);
    expect(result[2].popularity).toBe(140);
    expect(result[3].popularity).toBe(122); // Lowest
  });

  test('sorts by popularity ascending when specified', () => {
    const result = filterAndSortSessions(mockSessions, '', 'asc');
    expect(result[0].popularity).toBe(122); // Lowest
    expect(result[1].popularity).toBe(140);
    expect(result[2].popularity).toBe(187);
    expect(result[3].popularity).toBe(205); // Highest
  });

  test('maintains stable sort when popularities are equal', () => {
    const sessionsWithSamePopularity: Session[] = [
      { id: 's1', title: 'Session A', tags: [], mins: '5', difficulty: 'beginner', popularity: 100, updatedAt: '2025-01-01', completed: false },
      { id: 's3', title: 'Session C', tags: [], mins: '5', difficulty: 'beginner', popularity: 100, updatedAt: '2025-01-01', completed: false },
      { id: 's2', title: 'Session B', tags: [], mins: '5', difficulty: 'beginner', popularity: 100, updatedAt: '2025-01-01', completed: false },
    ];
    
    const result = filterAndSortSessions(sessionsWithSamePopularity, '', 'desc');
    // Should sort by ID as tie-breaker
    expect(result[0].id).toBe('s1');
    expect(result[1].id).toBe('s2');
    expect(result[2].id).toBe('s3');
  });

  test('trims whitespace from query', () => {
    const result = filterAndSortSessions(mockSessions, '  prompt  ', 'desc');
    expect(result).toHaveLength(2);
  });

  test('handles empty sessions array', () => {
    const result = filterAndSortSessions([], 'test', 'desc');
    expect(result).toHaveLength(0);
  });
});