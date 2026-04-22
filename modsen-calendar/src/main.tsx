import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store/store';
import { AppRouter } from '@/pages/AppRouter';
import '@/assets/styles/global.scss';
import { ToastContainer } from '@/components/common/Toast';
import { ErrorBoundary } from '@/utils/errorBoundary';

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
