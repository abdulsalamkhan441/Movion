import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { LoaderProvider } from './components/LoaderContext.jsx';
import MovionLoader from './components/MovionLoader.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <MovionLoader />
        <App />
      </LoaderProvider>
    </BrowserRouter>
  </StrictMode>
);
