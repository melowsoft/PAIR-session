import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Session, SortOrder } from '../types';
import { RAW_SESSIONS } from '../data';
import { SessionCard } from './components/SessionCard';
import { Controls } from './components/Controls';
import { useDebounce } from './hooks/useDebounce';
import { filterAndSortSessions } from './utils/filterSessions';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const App = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [simulateError, setSimulateError] = useState(false);
  
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const debouncedQuery = useDebounce(query, 300);

  const requestIdRef = useRef(0);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const currentRequestId = ++requestIdRef.current;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (simulateError) {
        throw new Error("Failed to fetch sessions. The server is acting up.");
      }

      if (currentRequestId === requestIdRef.current) {
        setSessions(prev => {
          if (prev.length === 0) return RAW_SESSIONS;
          return RAW_SESSIONS.map(s => {
              const existing = prev.find(p => p.id === s.id);
              return existing ? { ...s, completed: existing.completed } : s;
          });
        });
      }
    } catch (err: any) {
      if (currentRequestId === requestIdRef.current) {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [simulateError]);

  useEffect(() => {
    fetchSessions();
  }, []); 

  const toggleComplete = (id: string) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, completed: !session.completed } : session
    ));
  };

  const processedSessions = useMemo(() => {
    return filterAndSortSessions(sessions, debouncedQuery, sortOrder);
  }, [sessions, debouncedQuery, sortOrder]);

  return (
    <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <header className="py-8 md:py-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Learning Sessions
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                Browse our tutorials and track your progress.
                </p>
            </div>
        </div>
      </header>

      <main>
        <Controls 
          query={query} 
          setQuery={setQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          simulateError={simulateError}
          setSimulateError={setSimulateError}
          loading={loading}
          onRefresh={fetchSessions} // Pass fetchSessions as prop
        />

        {!loading && !error && processedSessions.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Found {processedSessions.length} session{processedSessions.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
          </div>
        )}

        <div 
  className="sr-only" 
  aria-live="polite" 
  aria-atomic="true"
  aria-label="Live announcements"
>
  {loading ? 'Loading sessions...' : ''}
  {error ? `Error: ${error}` : ''}
  {!loading && !error ? `Showing ${processedSessions.length} sessions sorted by popularity ${sortOrder === 'desc' ? 'descending' : 'ascending'}.` : ''}
</div>

        {loading && sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" aria-busy="true">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto" role="alert">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to load sessions</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
  onClick={fetchSessions}
  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
  aria-label="Try to load sessions again"
>
  <RefreshCw className="w-4 h-4" aria-hidden="true" />
  <span>Try Again</span>
</button>
          </div>
        ) : processedSessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No sessions found{query ? ` matching "${query}"` : ''}
            </p>
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {processedSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                highlightQuery={debouncedQuery}
                onToggleComplete={toggleComplete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;