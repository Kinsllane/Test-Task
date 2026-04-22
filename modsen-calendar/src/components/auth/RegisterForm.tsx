import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@/api/firebaseAuth';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { emailRegExp, getFirebaseErrorMessage, latinRegExp, passwordRegExp } from '@/utils/validators';
import { showToast } from '@/components/common/Toast';
import { IconButton } from '@/components/common/IconButton';
import eyeHide from '@/assets/icons/eye-hide.svg';
import { useAppDispatch, useAppSelector } from '@/common/reduxHooks';
import { setUser } from '@/store/authSlice';
import { setLoading } from '@/store/uiSlice';

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.ui.loading);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);

  const errors = useMemo(
    () => ({
      firstName: latinRegExp.test(firstName) ? '' : '2-50 latin symbols',
      lastName: latinRegExp.test(lastName) ? '' : '2-50 latin symbols',
      email: emailRegExp.test(email) ? '' : 'example@domain.com',
      password: passwordRegExp.test(password) ? '' : 'Min 8: Aa1!',
      confirm: password === confirm ? '' : 'Passwords do not match'
    }),
    [firstName, lastName, email, password, confirm]
  );
  const canSubmit = Object.values(errors).every((item) => !item);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      dispatch(setLoading(true));
      const user = await registerUser(email, password, firstName, lastName);
      dispatch(setUser({ firstName, lastName, email: user.email ?? email }));
      showToast('Registration success');
      navigate('/');
    } catch (error) {
      showToast(getFirebaseErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        label="First name"
        placeholder="Martin"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        error={errors.firstName}
      />
      <Input
        label="Last name"
        placeholder="Rogers"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        error={errors.lastName}
      />
      <Input
        label="Email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Password"
        placeholder="••••••••"
        type={show ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        rightAddon={
          <IconButton aria-label="toggle password" onClick={() => setShow((v) => !v)}>
            <img src={eyeHide} alt="" width={12} height={8} />
          </IconButton>
        }
      />
      <Input
        label="Confirm"
        placeholder="••••••••"
        type={show ? 'text' : 'password'}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />
      <Button variant="auth" disabled={!canSubmit || loading}>{loading ? 'Loading...' : 'Register'}</Button>
    </form>
  );
};
