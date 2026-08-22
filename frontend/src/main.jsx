import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';

import App from './App';
import { AuthProvider } from './context/AuthContext';

import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}