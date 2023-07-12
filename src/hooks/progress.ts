import { useEffect, useRef } from "react";

export const useVisualProgress = (duration: number, cb?: () => void) => {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  const percentage = useRef(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const interval = setInterval(() => {
      if (!indicatorRef.current) return;
      percentage.current += 0.2;
      indicatorRef.current.style.transform = `scaleX(${percentage.current.toFixed(
        3
      )})`;
      if (percentage.current >= 1) {
        timeout = setTimeout(() => {
          if (cb) cb();
          clearInterval(interval);
        }, duration / 5);
      }
    }, duration / 5);
    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [duration, cb]);

  return [progressRef, indicatorRef] as const;
};
