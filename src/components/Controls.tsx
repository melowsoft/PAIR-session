import React from 'react';
import { Search, ArrowDownUp, RefreshCw } from 'lucide-react';
import { SortOrder } from '../../types';

interface ControlsProps {
  query: string;
  setQuery: (q: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (o: SortOrder) => void;
  simulateError: boolean;
  setSimulateError: (b: boolean) => void;
  loading: boolean;
  onRefresh?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  query,
  setQuery,
  sortOrder,
  setSortOrder,
  simulateError,
  setSimulateError,
  loading,
  onRefresh
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 sticky top-4 z-10">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        
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

        <div className="flex flex-wrap items-center gap-3">
            <button
              id="sort-toggle"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              title="Toggle Sort Order"
              aria-label={`Sort by popularity ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
              aria-pressed={sortOrder === 'asc'} 
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

            {/* Refresh button - always visible */}
           <button
  onClick={onRefresh}
  disabled={loading}
  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
  title="Refresh sessions"
  aria-label="Refresh sessions list"
>
  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
  <span>Refresh</span> {/* Remove "hidden sm:inline" class */}
</button>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
            <button
              type="button"
              role="switch"
              aria-checked={simulateError}
              onClick={() => setSimulateError(!simulateError)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setSimulateError(!simulateError);
                }
              }}
              disabled={loading}
              className="relative inline-flex items-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 rounded"
              aria-label="Simulate error on next fetch"
            >
              <div 
                className={`w-11 h-6 ${simulateError ? 'bg-red-500' : 'bg-gray-200'} rounded-full transition-colors`}
                aria-hidden="true"
              >
                <div 
                  className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${simulateError ? 'translate-x-5' : ''}`}
                ></div>
              </div>
              <span className={`ml-2 text-sm font-medium transition-colors ${simulateError ? 'text-red-600' : 'text-gray-500'}`}>
                Simulate Error
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};