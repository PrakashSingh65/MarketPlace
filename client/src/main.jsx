import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';

import App from './App';
import { AuthProvider } from './context/AuthContext';

import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRoutes';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
}