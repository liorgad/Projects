import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logger from './utils/logger';

// Log application start
logger.info('Application starting...');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Configure reportWebVitals to use our logger
reportWebVitals(({ name, value }) => {
  logger.debug(`Web Vital: ${name} = ${value}`);
});

// Log application loaded
logger.info('Application loaded successfully');

// Add error tracking
window.addEventListener('error', (event) => {
  logger.error(`Uncaught error: ${event.message}`, { 
    stack: event.error?.stack,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});
