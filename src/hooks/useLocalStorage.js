import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) return JSON.parse(storedValue);
    } catch {
      localStorage.removeItem(key);
    }

    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
