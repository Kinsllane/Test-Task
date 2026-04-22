import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { getFirebaseAuth } from '@/services/firebase';

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const auth = getFirebaseAuth();
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(res.user, { displayName: `${firstName} ${lastName}` });
  return res.user;
};

export const loginUser = (email: string, password: string) => {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  const auth = getFirebaseAuth();
  return signOut(auth);
};
