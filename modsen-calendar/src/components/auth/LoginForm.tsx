import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/api/firebaseAuth';
import { useAppDispatch, useAppSelector } from '@/common/reduxHooks';
import { setUser } from '@/store/authSlice';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { showToast } from '@/components/common/Toast';
import { emailRegExp, getFirebaseErrorMessage } from '@/utils/validators';
import { IconButton } from '@/components/common/IconButton';
import eyeHide from '@/assets/icons/eye-hide.svg';
import { setLoading } from '@/store/uiSlice';

const formStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px'
};

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.ui.loading);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const canSubmit = emailRegExp.test(email) && password.length > 7;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await loginUser(email, password);
      const [firstName = '', lastName = ''] = (res.user.displayName ?? '').split(' ');
      dispatch(
        setUser({
          email: res.user.email ?? email,
          firstName,
          lastName,
          photoURL: res.user.photoURL ?? undefined
        })
      );
      navigate('/');
    } catch (error) {
      showToast(getFirebaseErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={onSubmit} style={formStyles}>
      <Input
        label="Email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        placeholder="••••••••"
        type={show ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        rightAddon={
          <IconButton aria-label="toggle password" onClick={() => setShow((v) => !v)}>
            <img src={eyeHide} alt="" width={12} height={8} />
          </IconButton>
        }
      />
      <Button variant="auth" disabled={!canSubmit || loading}>{loading ? 'Loading...' : 'Login'}</Button>
    </form>
  );
};
