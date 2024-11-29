import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import './index.css';
import App from './App';
import DatabaseService from './services/database';
import ErrorBoundary from './components/ErrorBoundary';

const renderApp = () => {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );
};

// Initialize database and render app
DatabaseService.init()
  .then(() => {
    console.log('Database initialized successfully');
    renderApp();
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    // Show error UI
  });
