# Learning Sessions Browser

A React-based web application for browsing AI learning sessions with search, sort, and progress tracking functionality.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Features

## Core Features

- Session Browsing: Display learning sessions with titles, tags, duration, difficulty, and popularity scores

- Interactive Search: Real-time search with 300ms debounce for optimal performance

- Smart Sorting: Sort sessions by popularity (ascending/descending) with stable sorting

- Progress Tracking: Mark sessions as complete/incomplete with visual feedback

- Responsive Design: Fully responsive layout that works on mobile, tablet, and desktop


## Project Structure

src/
├── components/          # React components
│   ├── Controls.tsx    # Search and filter controls
│   └── SessionCard.tsx # Individual session display
├── hooks/              # Custom React hooks
│   └── useDebounce.ts  # Debounce hook for search
├── utils/              # Utility functions
│   ├── filterSessions.ts # Filtering and sorting logic
│   └── textHighlight.tsx # Text highlighting component
├── types.ts            # TypeScript type definitions
├── data.ts             # Mock session data
└── __tests__/         # Test files
