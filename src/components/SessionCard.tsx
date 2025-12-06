import React from 'react';
import { Session } from '../../types';
import { HighlightText } from '../utils/textHighlight';
import { Clock, BarChart2, CheckCircle, Circle, TrendingUp } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  highlightQuery: string;
  onToggleComplete: (id: string) => void;
}

const DifficultyBadge = ({ level }: { level: string | null }) => {
  if (!level) return <span className="text-gray-400 text-xs font-medium px-2 py-0.5 border border-gray-200 rounded">N/A</span>;

  const colors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
    advanced: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const colorClass = colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${colorClass} capitalize flex items-center gap-1`}>
      <BarChart2 className="w-3 h-3" />
      {level}
    </span>
  );
};

export const SessionCard: React.FC<SessionCardProps> = ({ session, highlightQuery, onToggleComplete }) => {
  return (
    <article 
      className={`group relative flex flex-col bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 ${session.completed ? 'opacity-85 bg-gray-50' : ''}`}
      aria-labelledby={`session-title-${session.id}`}
    >
      {/* Top Meta Row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2">
            <DifficultyBadge level={session.difficulty} />
            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded flex items-center gap-1 border border-gray-200">
                <Clock className="w-3 h-3" />
                {session.mins} min
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-orange-50 text-orange-700 rounded flex items-center gap-1 border border-orange-100" title="Popularity Score">
                <TrendingUp className="w-3 h-3" />
                {session.popularity}
            </span>
        </div>
      </div>

      {/* Title */}
      <h3 id={`session-title-${session.id}`} className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors">
        <HighlightText text={session.title} highlight={highlightQuery} />
      </h3>

      {/* Tags */}
      <div className="mb-6 flex-grow">
       <div 
  className="flex flex-wrap gap-1.5"
  role="list"
  aria-label="Tags for this session"
>
  {session.tags.length > 0 ? (
    session.tags.map(tag => (
      <span 
        key={tag} 
        className="..."
        role="listitem"
      >
        {tag}
      </span>
    ))
  ) : (
    <span className="...">No tags</span>
  )}
</div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
        <button
  onClick={() => onToggleComplete(session.id)}
  className={`flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded-lg px-3 py-2 ${
      session.completed 
      ? 'text-green-700 bg-green-50 hover:bg-green-100' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }`}
  aria-pressed={session.completed}
  aria-label={`Mark "${session.title}" as ${session.completed ? 'incomplete' : 'complete'}`}
>
    {session.completed ? (
        <>
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
        </>
    ) : (
        <>
            <Circle className="w-4 h-4" />
            <span>Mark Complete</span>
        </>
    )}
</button>

        {session.completed && (
            <span className="text-xs font-semibold text-green-600">Done!</span>
        )}
      </div>
    </article>
  );
};