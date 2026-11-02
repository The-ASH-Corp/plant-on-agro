"use client";

import { useState, useEffect, useRef } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export function Counter({ target, suffix = "", duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const numTarget = Number(target) || 0;
    if (numTarget === 0) {
      setCount(0);
      return;
    }

    const isDecimal = !Number.isInteger(numTarget);
    let frameId: number;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * numTarget;
      setCount(isDecimal ? Number(current.toFixed(2)) : Math.round(current));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, target, duration]);

  const formattedSuffix = suffix
    ? /^[a-zA-Z]/.test(suffix)
      ? ` ${suffix}`
      : suffix
    : "";

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {formattedSuffix}
    </span>
  );
}
