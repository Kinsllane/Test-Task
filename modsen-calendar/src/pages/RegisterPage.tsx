import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Link } from 'react-router-dom';
import styles from '@/layouts/AuthLayout.module.scss';

export const RegisterPage = () => (
  <AuthLayout>
    <h1 className={styles.title}>Create Your Account</h1>
    <p className={styles.authLink}>
      Already have an account? <Link to="/login">Login</Link>
    </p>
    <RegisterForm />
  </AuthLayout>
);
