import { useRef } from "react";

export function useDebounce<T>(callback: (value: T) => void, delay = 300) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const debounce = (payload: T) => {
    const createTimeout = () => {
      const myTimeout = setTimeout(() => {
        callback(payload);
      }, delay);
      return myTimeout;
    };

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = createTimeout();
  };

  return debounce;
}
