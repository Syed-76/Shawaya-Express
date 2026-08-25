import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Intercept and safely ignore third-party browser extension errors (e.g. MetaMask, Web3 wallet injection in iframes)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason?.message || String(event?.reason || '');
    if (
      reason.toLowerCase().includes('metamask') ||
      reason.toLowerCase().includes('ethereum') ||
      reason.toLowerCase().includes('web3')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const message = event?.message || '';
    if (
      message.toLowerCase().includes('metamask') ||
      message.toLowerCase().includes('ethereum') ||
      message.toLowerCase().includes('web3')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

