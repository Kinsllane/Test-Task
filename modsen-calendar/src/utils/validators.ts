export const dateRegExp = /^\d{2}\.\d{2}\.\d{4}$/;
export const durationRegExp = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
export const latinRegExp = /^[A-Za-z]{2,50}$/;
export const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const validateEventTitle = (value: string) => value.trim().length > 0 && value.length <= 40;
export const validateEventPlace = (value: string) => value.trim().length > 0 && value.length <= 20;

export const getFirebaseErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'Unknown auth error';
  }
  const message = error.message.toLowerCase();
  if (message.includes('missing')) return 'Firebase is not configured. Fill .env and restart dev server.';
  if (message.includes('email-already-in-use')) return 'Email is already in use.';
  if (message.includes('invalid-email')) return 'Invalid email format.';
  if (message.includes('invalid-credential') || message.includes('wrong-password')) {
    return 'Invalid email or password.';
  }
  if (message.includes('user-not-found')) return 'User not found.';
  if (message.includes('weak-password')) return 'Password is too weak.';
  return error.message;
};
export const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};