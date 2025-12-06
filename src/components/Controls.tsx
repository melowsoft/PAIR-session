import React from 'react';
import { Search, ArrowDownUp, AlertTriangle } from 'lucide-react';
import { SortOrder } from '../../types';

interface ControlsProps {
  query: string;
  setQuery: (q: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (o: SortOrder) => void;
  simulateError: boolean;
  setSimulateError: (b: boolean) => void;
  loading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  query,
  setQuery,
  sortOrder,
  setSortOrder,
  simulateError,
  setSimulateError,
  loading
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 sticky top-4 z-10">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        
        {/* Search */}
        <div className="relative flex-grow max-w-lg">
          <label htmlFor="search-sessions" className="sr-only">
            Search sessions by title
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            id="search-sessions"
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
            placeholder="Search sessions by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            aria-label="Search sessions by title"
            aria-busy={loading}
          />
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-3">
            {/* Sort Toggle */}
            <button
  id="sort-toggle"
  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
  disabled={loading}
  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
  title="Toggle Sort Order"
  aria-label={`Sort by popularity ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
  aria-pressed={sortOrder === 'asc'} // This should be true for 'asc', false for 'desc'
>
  <ArrowDownUp className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
  <span className="hidden sm:inline">Popularity</span>
  <span 
    className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs uppercase"
    aria-label={`Current sort order: ${sortOrder}`}
  >
    {sortOrder}
  </span>
</button>

            {/* Error Simulator Toggle */}
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <label className="relative inline-flex items-center cursor-pointer group">
                <input 
                  id="error-toggle"
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  disabled={loading}
                  aria-label="Simulate error on next fetch"
                />
                <div 
                  className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"
                  aria-hidden="true"
                ></div>
                <span className={`ml-2 text-sm font-medium transition-colors ${simulateError ? 'text-red-600' : 'text-gray-500'}`}>
                  Simulate Error
                </span>
              </label>
            </div>
        </div>
      </div>
    </div>
  );
};