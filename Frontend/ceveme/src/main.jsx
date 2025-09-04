import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routers/AppRoutes';
import './index.css';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <>
    <AppRoutes />
    <ToastContainer position="bottom-right" reverseOrder={false} />
  </>
);
