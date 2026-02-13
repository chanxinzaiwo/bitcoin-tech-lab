import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initWebVitals } from './utils/analytics';

// Initialize i18n (must be imported before App)
import './i18n';

// Initialize Web Vitals monitoring
initWebVitals();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);