import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CalendarPage } from '@/pages/CalendarPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/common/reduxHooks';

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AppRouter = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PrivateRoute>
          <MainLayout>
            <CalendarPage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Routes>
);
