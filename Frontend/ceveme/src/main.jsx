import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routers/AppRoutes';
import './index.css';
import { ToastContainer } from 'react-toastify';

// ⬇️ NOWE: cache fontów
import { registerFontSW } from '../src/features/cv/canvasCv/ui/sidebar/registerServiceWorker';
import { warmupFontsFromCacheIdle } from '../src/features/cv/canvasCv/ui/sidebar/googleFontsLoader';

// zainicjalizuj cache na starcie
registerFontSW();
warmupFontsFromCacheIdle();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
    <ToastContainer position="bottom-right" reverseOrder={false} />
  </StrictMode>
);
