import { useState, useEffect, useCallback, useRef } from 'react';

export function useCountdown(totalSeconds: number, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setSeconds(totalSeconds);
    setIsRunning(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const percentage = (seconds / totalSeconds) * 100;

  return { seconds, formatted, percentage, isRunning, start, pause, reset };
}
