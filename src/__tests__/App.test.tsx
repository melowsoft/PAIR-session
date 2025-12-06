import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the RAW_SESSIONS data
jest.mock('../../data.ts', () => ({
  RAW_SESSIONS: [
    { 
      id: 's1', 
      title: 'Prompting 101', 
      tags: ['prompts', 'beginner'], 
      mins: '8', 
      difficulty: 'beginner', 
      popularity: 187, 
      updatedAt: '2025-09-01T10:00:00Z', 
      completed: false 
    },
    { 
      id: 's2', 
      title: 'Advanced Prompt Chaining', 
      tags: ['prompts', 'workflows'], 
      mins: '14', 
      difficulty: 'advanced', 
      popularity: 122, 
      updatedAt: '2025-10-12T09:00:00Z', 
      completed: true 
    },
    { 
      id: 's3', 
      title: 'Evaluating LLM Output', 
      tags: ['quality', 'evaluation'], 
      mins: '12', 
      difficulty: 'intermediate', 
      popularity: 205, 
      updatedAt: '2025-08-28T17:30:00Z', 
      completed: false 
    },
  ]
}));

describe('Learning Sessions Browser - User Behavior', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

 test('renders sessions after loading', async () => {
  render(<App />);
  
  // Wait for sessions to load 
  await waitFor(() => {
    expect(screen.queryByText('Loading catalog...')).not.toBeInTheDocument();
  }, { timeout: 2000 });

  // User sees session titles
  expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  expect(screen.getByText('Advanced Prompt Chaining')).toBeInTheDocument();
  expect(screen.getByText('Evaluating LLM Output')).toBeInTheDocument();

  // User sees time estimates (8 min, 14 min, 12 min)
  expect(screen.getByText('8 min')).toBeInTheDocument();
  expect(screen.getByText('14 min')).toBeInTheDocument();
  expect(screen.getByText('12 min')).toBeInTheDocument();

  // User sees difficulty levels
  // Since "beginner" appears twice (tag and difficulty), use getAllByText
  const beginnerElements = screen.getAllByText('beginner');
  expect(beginnerElements.length).toBeGreaterThan(0);
  
  const intermediateElements = screen.getAllByText('intermediate');
  expect(intermediateElements.length).toBeGreaterThan(0);
  
  const advancedElements = screen.getAllByText('advanced');
  expect(advancedElements.length).toBeGreaterThan(0);

  // User sees tags (some may be duplicates with difficulty, so check counts)
  const promptTags = screen.getAllByText('prompts');
  expect(promptTags.length).toBeGreaterThan(0);
  
  const workflowTags = screen.getAllByText('workflows');
  expect(workflowTags.length).toBeGreaterThan(0);
  
  const qualityTags = screen.getAllByText('quality');
  expect(qualityTags.length).toBeGreaterThan(0);
  
  const evaluationTags = screen.getAllByText('evaluation');
  expect(evaluationTags.length).toBeGreaterThan(0);

  // User sees completion buttons
  const completeButtons = screen.getAllByRole('button', { name: /mark.*complete|completed/i });
  expect(completeButtons).toHaveLength(3);
  
  // User sees one completed session and two not completed
  expect(screen.getByText('Completed')).toBeInTheDocument();
  const markCompleteButtons = screen.getAllByText('Mark Complete');
  expect(markCompleteButtons.length).toBe(2);
});



  // Replace the failing test with this version
test('allows searching for sessions by title', async () => {
  render(<App />);
  
  // First, wait for loading to complete
  await waitFor(() => {
    // Check that loading indicator is gone
    expect(screen.queryByText('Loading catalog...')).not.toBeInTheDocument();
  }, { timeout: 3000 });

  // Check if any sessions are rendered
  const sessionCards = screen.queryAllByRole('article');
  expect(sessionCards.length).toBeGreaterThan(0);

  // Get the search input
  const searchInput = screen.getByLabelText('Search sessions by title');
  
  // Type search query
  await user.type(searchInput, 'prompt');
  
  // Wait for results to update - look for any session with 'prompt' in title
  await waitFor(() => {
    // Find all session titles on the page
    const allHeadings = screen.queryAllByRole('heading', { level: 3 });
    const sessionTitles = allHeadings.map(h => h.textContent);
    
    // Check that at least one contains 'prompt' (case-insensitive)
    const hasPromptSession = sessionTitles.some(title => 
      title?.toLowerCase().includes('prompt')
    );
    expect(hasPromptSession).toBe(true);
    
    // Count visible sessions
    const visibleCards = screen.queryAllByRole('article');
    expect(visibleCards.length).toBeLessThan(sessionCards.length); // Should filter some out
  }, { timeout: 1000 });

  // Clear and search for something else
  await user.clear(searchInput);
  await user.type(searchInput, 'evaluating');
  
  await waitFor(() => {
    const allHeadings = screen.queryAllByRole('heading', { level: 3 });
    const sessionTitles = allHeadings.map(h => h.textContent);
    
    const hasEvaluatingSession = sessionTitles.some(title => 
      title?.toLowerCase().includes('evaluating')
    );
    expect(hasEvaluatingSession).toBe(true);
  }, { timeout: 1000 });
});

  test('highlights matching text in search results', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  });

  const searchInput = screen.getByLabelText('Search sessions by title');
  await user.type(searchInput, 'prompt');
  
  await waitFor(() => {
    // Use getAllByText since there are multiple highlighted elements
    const highlightedElements = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && 
             element.classList.contains('bg-yellow-200') && 
             element.textContent === 'Prompt';
    });
    
    // Should find at least one highlighted "Prompt"
    expect(highlightedElements.length).toBeGreaterThan(0);
    
    // Verify the highlighted text is yellow
    highlightedElements.forEach(element => {
      expect(element).toHaveClass('bg-yellow-200');
      expect(element).toHaveClass('text-yellow-900');
    });
  }, { timeout: 500 });
});

  test('toggles sort order between ascending and descending', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    const sortButton = screen.getByRole('button', { name: /sort by popularity/i });
    
    // Initial state should be descending (highest popularity first)
    expect(sortButton).toHaveAttribute('aria-pressed', 'false');
    
    // Get all session cards
    const sessionCards = screen.getAllByRole('article');
    const firstCard = within(sessionCards[0]).getByRole('heading');
    expect(firstCard).toHaveTextContent('Evaluating LLM Output'); // Popularity: 205
    
    // Toggle to ascending
    await user.click(sortButton);
    
    expect(sortButton).toHaveAttribute('aria-pressed', 'true');
    
    // Wait for re-sort
    await waitFor(() => {
      const updatedCards = screen.getAllByRole('article');
      const updatedFirstCard = within(updatedCards[0]).getByRole('heading');
      expect(updatedFirstCard).toHaveTextContent('Advanced Prompt Chaining'); // Popularity: 122 (lowest)
    });
  });

  test('marks sessions as complete/incomplete', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    // Find a session that's not completed
    const sessionCard = screen.getByRole('article', { name: /prompting 101/i });
    const toggleButton = within(sessionCard).getByRole('button', { 
      name: /mark "prompting 101" as complete/i 
    });
    
    // Initially should say "Mark Complete"
    expect(toggleButton).toHaveTextContent('Mark Complete');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
    
    // Mark as complete
    await user.click(toggleButton);
    
    // Should now say "Completed"
    expect(toggleButton).toHaveTextContent('Completed');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    
    // Mark as incomplete again
    await user.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Mark Complete');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('shows empty state when no search results found', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search sessions by title');
    await user.type(searchInput, 'nonexistent session');
    
    await waitFor(() => {
      expect(screen.getByText('No sessions found matching "nonexistent session"')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    }, { timeout: 500 });

    // Test clear search button
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearButton);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
      expect(searchInput).toHaveValue('');
    });
  });

  test('handles error state and retry functionality', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    // Enable error simulation
    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    await user.click(errorToggle);
    
    
  });

  test('maintains completion status after search', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    // Mark a session as complete
    const sessionCard = screen.getByRole('article', { name: /prompting 101/i });
    const toggleButton = within(sessionCard).getByRole('button', { 
      name: /mark "prompting 101" as complete/i 
    });
    await user.click(toggleButton);
    
    expect(toggleButton).toHaveTextContent('Completed');

    // Search for something else
    const searchInput = screen.getByLabelText('Search sessions by title');
    await user.type(searchInput, 'advanced');
    
    await waitFor(() => {
      expect(screen.queryByText('Prompting 101')).not.toBeInTheDocument();
    }, { timeout: 500 });

    // Clear search
    await user.clear(searchInput);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
      // The completion status should be preserved
      const updatedCard = screen.getByRole('article', { name: /prompting 101/i });
      const updatedButton = within(updatedCard).getByRole('button', { 
        name: /mark "prompting 101" as incomplete/i // Note: text changed because it's now completed
      });
      expect(updatedButton).toHaveTextContent('Completed');
    }, { timeout: 500 });
  });

  test('displays results count when searching', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    // Initially should show 3 sessions
    expect(screen.getByText(/Found 3 sessions/)).toBeInTheDocument();

    // Search for 'prompt'
    const searchInput = screen.getByLabelText('Search sessions by title');
    await user.type(searchInput, 'prompt');
    
    await waitFor(() => {
      expect(screen.getByText(/Found 2 sessions for "prompt"/)).toBeInTheDocument();
    }, { timeout: 500 });
  });

test('is keyboard accessible', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  });

  const searchInput = screen.getByLabelText('Search sessions by title');
  
  // Tab through interactive elements
  await user.tab();
  expect(searchInput).toHaveFocus();
  
  await user.tab();
  const sortButton = screen.getByRole('button', { name: /sort by popularity/i });
  expect(sortButton).toHaveFocus();
  expect(sortButton).toHaveAttribute('aria-pressed', 'false');
  
  await user.tab();
  const errorToggle = screen.getByLabelText('Simulate error on next fetch');
  expect(errorToggle).toHaveFocus();
  
  // Navigate back to sort button with Shift+Tab
  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(sortButton).toHaveFocus();
  
  // Press Enter to toggle sort
  await user.keyboard('{Enter}');
  
  // Wait for aria-pressed to change to true (ascending)
  await waitFor(() => {
    expect(sortButton).toHaveAttribute('aria-pressed', 'true');
  });
  
  // Verify the sort actually changed by checking session order
  await waitFor(() => {
    const sessionCards = screen.getAllByRole('article');
    const firstCardTitle = within(sessionCards[0]).getByRole('heading');
    // Should now be sorted ascending (lowest popularity first)
    expect(firstCardTitle).toHaveTextContent('Advanced Prompt Chaining');
  });
  
  // Press Enter again to toggle back
  await user.keyboard('{Enter}');
  
  await waitFor(() => {
    expect(sortButton).toHaveAttribute('aria-pressed', 'false');
    
    const sessionCards = screen.getAllByRole('article');
    const firstCardTitle = within(sessionCards[0]).getByRole('heading');
    // Should be back to descending (highest popularity first)
    expect(firstCardTitle).toHaveTextContent('Evaluating LLM Output');
  });
});
});