import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Error Simulation', () => {
    const user = userEvent.setup();
  test('displays error simulation toggle in controls', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    expect(errorToggle).toBeInTheDocument();
    expect(errorToggle).not.toBeChecked();
    
    // Label should be visible
    expect(screen.getByText('Simulate Error')).toBeInTheDocument();
  });

  test('enabling error toggle changes its visual state', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    const errorLabel = screen.getByText('Simulate Error');
    
    // Initially should not have red text
    expect(errorLabel).toHaveClass('text-gray-500');
    expect(errorLabel).not.toHaveClass('text-red-600');
    
    // Enable error simulation
    await user.click(errorToggle);
    
    // Should now have red text
    expect(errorToggle).toBeChecked();
    expect(errorLabel).toHaveClass('text-red-600');
    expect(errorLabel).not.toHaveClass('text-gray-500');
  });

 test('shows error state when refresh is clicked with error simulation enabled', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  });

  // Enable error simulation
  const errorToggle = screen.getByLabelText('Simulate error on next fetch');
  await user.click(errorToggle);
  expect(errorToggle).toBeChecked();
  
  // Click refresh button
  const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
  await user.click(refreshButton);
  
  
  // Wait for error to appear
  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Unable to load sessions')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch sessions. The server is acting up.')).toBeInTheDocument();
  }, { timeout: 2000 });
  
  // Should have retry button
  const retryButton = screen.getByRole('button', { name: /try to load sessions again/i });
  expect(retryButton).toBeInTheDocument();
});

  test('retry button works after error', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  });

  // Enable error simulation and trigger error
  const errorToggle = screen.getByLabelText('Simulate error on next fetch');
  await user.click(errorToggle);
  
  const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
  await user.click(refreshButton);
  
  // Wait for error
  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  }, { timeout: 2000 });
  
  // Disable error simulation
  await user.click(errorToggle);
  expect(errorToggle).not.toBeChecked();
  
  // Click retry button - use the actual aria-label
  const retryButton = screen.getByRole('button', { name: /try to load sessions again/i });
  await user.click(retryButton);
  
  // Should successfully load sessions
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  }, { timeout: 2000 });
});

 test('error simulation works with keyboard navigation', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  });

  // Tab to error toggle
  await user.tab(); // Search input
  await user.tab(); // Sort button
  await user.tab(); // Refresh button
  await user.tab(); // Error toggle
  
  const errorToggle = screen.getByLabelText('Simulate error on next fetch');
  expect(errorToggle).toHaveFocus();
  expect(errorToggle).not.toBeChecked();
  
  // Enable with Space key (standard keyboard interaction for checkboxes)
  await user.keyboard(' ');
  expect(errorToggle).toBeChecked();
  
  // Disable with Space key
  await user.keyboard(' ');
  expect(errorToggle).not.toBeChecked();
  
  // Can toggle multiple times with Space
  await user.keyboard(' ');
  expect(errorToggle).toBeChecked();
  
  await user.keyboard(' ');
  expect(errorToggle).not.toBeChecked();
});

  test('refresh button is disabled during loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    // Enable error simulation
    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    await user.click(errorToggle);
    
    // Click refresh to trigger loading
    const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
    await user.click(refreshButton);
    
    // Refresh button should be disabled during loading
    expect(refreshButton).toBeDisabled();
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // After error, refresh button should be enabled again
    expect(refreshButton).not.toBeDisabled();
  });

  test('error simulation persists after page interactions', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    // Enable error simulation
    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    await user.click(errorToggle);
    expect(errorToggle).toBeChecked();
    
    // Perform other interactions
    const searchInput = screen.getByLabelText('Search sessions by title');
    await user.type(searchInput, 'prompt');
    
    await waitFor(() => {
      expect(screen.getByText('Found 2 sessions for "prompt"')).toBeInTheDocument();
    }, { timeout: 500 });
    
    // Error simulation should still be enabled
    expect(errorToggle).toBeChecked();
    
    // Clear search
    await user.clear(searchInput);
    
    // Error simulation should still be enabled
    expect(errorToggle).toBeChecked();
  });

  test('shows loading indicators appropriately', async () => {
  render(<App />);
  
  // Initial load should show loading spinner
  expect(screen.getByText('Loading catalog...')).toBeInTheDocument();
  
  // Wait for initial load to complete
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  }, { timeout: 2000 });
  
  // Enable error simulation
  const errorToggle = screen.getByLabelText('Simulate error on next fetch');
  await user.click(errorToggle);
  
  // Click refresh
  const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
  await user.click(refreshButton);
  
  // During refresh (not initial load), no loading spinner shows
  // But user should see the error after the simulated delay
  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  }, { timeout: 2000 });
  
  // Should have error message
  expect(screen.getByText('Unable to load sessions')).toBeInTheDocument();
});

  test('error message includes retry instructions', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  });

  // Enable error simulation and trigger error
  const errorToggle = screen.getByLabelText('Simulate error on next fetch');
  await user.click(errorToggle);
  
  const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
  await user.click(refreshButton);
  
  // Wait for error
  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  }, { timeout: 2000 });
  
  // Check error content is user-friendly
  const alert = screen.getByRole('alert');
  expect(within(alert).getByText('Unable to load sessions')).toBeInTheDocument();
  expect(within(alert).getByText('Failed to fetch sessions. The server is acting up.')).toBeInTheDocument();
  
  // Find the retry button by looking for the button that contains "Try Again" text
  const retryButton = within(alert).getByRole('button');
  expect(retryButton).toBeInTheDocument();
  
  // Verify it contains the "Try Again" text
  expect(within(retryButton).getByText('Try Again')).toBeInTheDocument();
});

  test('can toggle error simulation on and off multiple times', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    
    // Toggle multiple times
    await user.click(errorToggle); // On
    expect(errorToggle).toBeChecked();
    
    await user.click(errorToggle); // Off
    expect(errorToggle).not.toBeChecked();
    
    await user.click(errorToggle); // On
    expect(errorToggle).toBeChecked();
    
    await user.click(errorToggle); // Off
    expect(errorToggle).not.toBeChecked();
    
    // Final state should work correctly
    await user.click(errorToggle); // On
    const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
    await user.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

test('search input is disabled during loading from error simulation', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText('Prompting 101')).toBeInTheDocument();
  });

  const searchInput = screen.getByLabelText('Search sessions by title');
  const errorToggle = screen.getByLabelText('Simulate error on next fetch');
  
  // Enable error and trigger fetch
  await user.click(errorToggle);
  const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
  await user.click(refreshButton);
  
  // Search should show loading state (aria-busy)
  expect(searchInput).toHaveAttribute('aria-busy', 'true');
  
  // Wait for error
  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  }, { timeout: 2000 });
  
  // Search should not be busy after error
  expect(searchInput).toHaveAttribute('aria-busy', 'false');
});

  test('sort button is disabled during loading from error simulation', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    const sortButton = screen.getByRole('button', { name: /sort by popularity/i });
    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    
    // Enable error and trigger fetch
    await user.click(errorToggle);
    const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
    await user.click(refreshButton);
    
    // Sort button should be disabled during loading
    expect(sortButton).toBeDisabled();
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Sort button should be enabled again after error
    expect(sortButton).not.toBeDisabled();
  });

  test('live region announces error state to screen readers', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Prompting 101')).toBeInTheDocument();
    });

    // Enable error and trigger fetch
    const errorToggle = screen.getByLabelText('Simulate error on next fetch');
    await user.click(errorToggle);
    
    const refreshButton = screen.getByRole('button', { name: /refresh sessions/i });
    await user.click(refreshButton);
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Check live region content
    const liveRegion = screen.getByLabelText('Live announcements');
    expect(liveRegion).toHaveTextContent('Error: Failed to fetch sessions. The server is acting up.');
  });
});