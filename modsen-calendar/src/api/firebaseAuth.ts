import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail
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

export const updateUserProfile = async (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  if (data.firstName || data.lastName) {
    const displayName = `${data.firstName ?? user.displayName?.split(' ')[0] ?? ''} ${data.lastName ?? user.displayName?.split(' ')[1] ?? ''}`.trim();
    await updateProfile(user, { displayName });
  }

  if (data.email && data.email !== user.email) {
    await updateEmail(user, data.email);
  }

  return user;
};
