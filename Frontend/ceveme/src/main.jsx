// src/main.jsx (albo odpowiednik pliku startowego)
// ⬇️ USUNIĘTO warm-up z cache, zostawiono tylko rejestrację SW (nie prefetchuje)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routers/AppRoutes';
import './index.css';
import { ToastContainer } from 'react-toastify';

import { registerFontSW } from '../src/features/cv/canvasCv/ui/sidebar/registerServiceWorker';

registerFontSW();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
    <ToastContainer position="bottom-right" reverseOrder={false} />
  </StrictMode>
);
