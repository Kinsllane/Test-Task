import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Link } from 'react-router-dom';
import styles from '@/layouts/AuthLayout.module.scss';

export const LoginPage = () => (
  <AuthLayout>
    <h1 className={styles.title}>Login</h1>
    <p className={styles.authLink}>
      Don't have an account? <Link to="/register">Create Now</Link>
    </p>
    <LoginForm />
  </AuthLayout>
);
