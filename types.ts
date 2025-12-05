export interface Session {
  id: string;
  title: string;
  tags: string[];
  mins: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null | string;
  popularity: number;
  updatedAt: string;
  completed: boolean;
}

export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  query: string;
  sortOrder: SortOrder;
}