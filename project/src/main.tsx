import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AnimationProvider } from './components/common/GameAnimations';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnimationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AnimationProvider>
  </React.StrictMode>
);
