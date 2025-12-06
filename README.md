# PAIR Learning Sessions App

A responsive, accessible React + TypeScript application built with
**Vite** and styled with **TailwindCSS**. The app displays a catalog of
learning sessions, allows users to search and sort them, track
completion, simulate fetch errors, and test UI behaviour using
**Jest** + **React Testing Library**.

## 🚀 Features

### ✔ Real-time Search (Debounced)

-   Search sessions by title or description.
-   Uses a custom `useDebounce` hook for optimal performance.

### ✔ Sorting

-   Sort sessions by popularity (ascending or descending).

### ✔ Completion Tracking

-   Toggle sessions as completed or not.

### ✔ Error Simulation

-   Toggle to simulate API failures with retry behaviour.

### ✔ Loading States

-   Animated loader using Lucide icons.
-   Full ARIA accessibility support.

### ✔ Fully Tested

-   Unit & integration tests (Jest + RTL + jest-dom).

## 📁 Project Structure

    src/
     ├── components/
     ├── hooks/
     ├── utils/
     ├── __tests__/
     ├── App.tsx
     └── main.tsx

## 🛠 Tech Stack

-   React 19 + TypeScript
-   Vite
-   TailwindCSS
-   Jest + React Testing Library
-   ESLint + Prettier

## 📦 Installation

    npm install

## 🔧 Scripts

    npm run dev
    npm run build
    npm run preview
    npm run lint
    npm run test
    npm run test:watch
    npm run test:coverage

## ▶️ Running the App

    npm run dev

App opens at: http://localhost:5173
