export const normalizeDate = (date: string) => {
  const [d, m, y] = date.split('.');
  return `${y}-${m}-${d}`;
};

export const toUiDate = (date: Date) => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
};
