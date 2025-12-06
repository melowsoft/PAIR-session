import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionCard } from '../components/SessionCard';
import type { Session } from '../../types';

jest.mock('../../src/utils/textHighlight.tsx', () => ({
  HighlightText: ({ text, highlight }: { text: string; highlight: string }) => (
    <span data-testid="highlight-text" data-highlight={highlight}>
      {text}
    </span>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Clock: () => <span data-testid="clock-icon">⏰</span>,
  BarChart2: () => <span data-testid="barchart-icon">📊</span>,
  CheckCircle: () => <span data-testid="check-icon">✓</span>,
  Circle: () => <span data-testid="circle-icon">○</span>,
  TrendingUp: () => <span data-testid="trending-icon">📈</span>,
}));

describe('SessionCard Component', () => {
  const mockSession: Session = {
    id: 's1',
    title: 'Prompting 101',
    tags: ['prompts', 'beginner'],
    mins: '8',
    difficulty: 'beginner',
    popularity: 187,
    updatedAt: '2025-09-01T10:00:00Z',
    completed: false,
  };

  const mockOnToggleComplete = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders session title correctly', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /prompting 101/i })).toBeInTheDocument();
  });

  test('passes highlight query to HighlightText component', () => {
    const highlightQuery = 'prompt';
    render(
      <SessionCard
        session={mockSession}
        highlightQuery={highlightQuery}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const highlightElement = screen.getByTestId('highlight-text');
    expect(highlightElement).toHaveAttribute('data-highlight', highlightQuery);
  });

test('renders difficulty badge with correct styling for beginner level', () => {
  render(
    <SessionCard
      session={mockSession}
      highlightQuery=""
      onToggleComplete={mockOnToggleComplete}
    />
  );

  // Find the difficulty badge by looking for the container that has the barchart icon
  const barchartIcon = screen.getByTestId('barchart-icon');
  // Get the parent span that contains both the icon and the text
  const difficultyBadge = barchartIcon.parentElement;
  
  expect(difficultyBadge).toBeInTheDocument();
  expect(difficultyBadge).toHaveTextContent('beginner');
  expect(difficultyBadge).toHaveClass('bg-green-100');
  expect(difficultyBadge).toHaveClass('text-green-700');
});

  test('renders difficulty badge with correct styling for intermediate level', () => {
    const intermediateSession: Session = {
      ...mockSession,
      difficulty: 'intermediate',
    };

    render(
      <SessionCard
        session={intermediateSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const difficultyBadge = screen.getByText('intermediate');
    expect(difficultyBadge).toBeInTheDocument();
    expect(difficultyBadge).toHaveClass('bg-blue-100');
    expect(difficultyBadge).toHaveClass('text-blue-700');
  });

  test('renders difficulty badge with correct styling for advanced level', () => {
    const advancedSession: Session = {
      ...mockSession,
      difficulty: 'advanced',
    };

    render(
      <SessionCard
        session={advancedSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const difficultyBadge = screen.getByText('advanced');
    expect(difficultyBadge).toBeInTheDocument();
    expect(difficultyBadge).toHaveClass('bg-purple-100');
    expect(difficultyBadge).toHaveClass('text-purple-700');
  });

  test('renders "N/A" when difficulty is null', () => {
    const nullDifficultySession: Session = {
      ...mockSession,
      difficulty: null,
    };

    render(
      <SessionCard
        session={nullDifficultySession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toHaveClass('text-gray-400');
  });

  test('renders session duration correctly', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('8 min')).toBeInTheDocument();
  });

  test('renders popularity score correctly', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('187')).toBeInTheDocument();
  });

  test('renders all tags in an accessible list', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const tagsList = screen.getByRole('list', { name: /tags for this session/i });
    expect(tagsList).toBeInTheDocument();

    const tagItems = within(tagsList).getAllByRole('listitem');
    expect(tagItems).toHaveLength(2);
    expect(tagItems[0]).toHaveTextContent('prompts');
    expect(tagItems[1]).toHaveTextContent('beginner');
  });

  test('shows "No tags" message when tags array is empty', () => {
    const noTagsSession: Session = {
      ...mockSession,
      tags: [],
    };

    render(
      <SessionCard
        session={noTagsSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('No tags')).toBeInTheDocument();
  });

  test('renders "Mark Complete" button for incomplete sessions', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /mark "prompting 101" as complete/i,
    });

    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent('Mark Complete');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
    expect(toggleButton).toHaveClass('text-gray-600');
  });

  test('renders "Completed" button for completed sessions', () => {
    const completedSession: Session = {
      ...mockSession,
      completed: true,
    };

    render(
      <SessionCard
        session={completedSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /mark "prompting 101" as incomplete/i,
    });

    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent('Completed');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    expect(toggleButton).toHaveClass('text-green-700');
    expect(toggleButton).toHaveClass('bg-green-50');
  });

  test('calls onToggleComplete with session id when button is clicked', async () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /mark "prompting 101" as complete/i,
    });

    await user.click(toggleButton);
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockOnToggleComplete).toHaveBeenCalledWith('s1');
  });

  test('calls onToggleComplete when pressing Enter on the button', async () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /mark "prompting 101" as complete/i,
    });

    toggleButton.focus();
    await user.keyboard('{Enter}');
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockOnToggleComplete).toHaveBeenCalledWith('s1');
  });

  test('calls onToggleComplete when pressing Space on the button', async () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /mark "prompting 101" as complete/i,
    });

    toggleButton.focus();
    await user.keyboard(' ');
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockOnToggleComplete).toHaveBeenCalledWith('s1');
  });

  test('shows "Done!" badge when session is completed', () => {
    const completedSession: Session = {
      ...mockSession,
      completed: true,
    };

    render(
      <SessionCard
        session={completedSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('Done!')).toBeInTheDocument();
    expect(screen.getByText('Done!')).toHaveClass('text-green-600');
  });

  test('does not show "Done!" badge when session is not completed', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.queryByText('Done!')).not.toBeInTheDocument();
  });

  test('applies completed styling when session is completed', () => {
    const completedSession: Session = {
      ...mockSession,
      completed: true,
    };

    render(
      <SessionCard
        session={completedSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const article = screen.getByRole('article');
    expect(article).toHaveClass('opacity-85');
    expect(article).toHaveClass('bg-gray-50');
  });

  test('does not apply completed styling when session is not completed', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const article = screen.getByRole('article');
    expect(article).not.toHaveClass('opacity-85');
    expect(article).not.toHaveClass('bg-gray-50');
  });

  test('has proper accessibility attributes for the article', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby', `session-title-${mockSession.id}`);
  });

  test('has proper accessibility attributes for the title', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveAttribute('id', `session-title-${mockSession.id}`);
  });

  test('has proper title attribute for popularity score', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const popularityElement = screen.getByText('187');
   
    const popularityContainer = popularityElement.closest('span');
    expect(popularityContainer).toHaveAttribute('title', 'Popularity Score');
  });

  test('handles unknown difficulty levels gracefully', () => {
    const unknownDifficultySession: Session = {
      ...mockSession,
      difficulty: 'expert' as any, // Using "as any" to test unexpected values
    };

    render(
      <SessionCard
        session={unknownDifficultySession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const difficultyBadge = screen.getByText('expert');
    expect(difficultyBadge).toBeInTheDocument();
    expect(difficultyBadge).toHaveClass('bg-gray-100');
    expect(difficultyBadge).toHaveClass('text-gray-600');
  });

  test('includes all icons in the component', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('barchart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trending-icon')).toBeInTheDocument();
  });

  test('shows check icon for completed sessions', () => {
    const completedSession: Session = {
      ...mockSession,
      completed: true,
    };

    render(
      <SessionCard
        session={completedSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  test('shows circle icon for incomplete sessions', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
  });

  test('has hover styles applied correctly', () => {
    render(
      <SessionCard
        session={mockSession}
        highlightQuery=""
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const article = screen.getByRole('article');
    expect(article).toHaveClass('hover:shadow-md');
    expect(article).toHaveClass('hover:border-blue-300');
  });
});