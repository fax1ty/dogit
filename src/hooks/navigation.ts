import throttle from "just-throttle";
import { useEffect, useRef } from "react";

import { useAppStore } from "../store/app";

export const useArrowNavigation = <T extends HTMLElement = HTMLDivElement>(
  onPrev?: () => void,
  onNext?: () => void
) => {
  const ref = useRef<T | null>(null);
  const focused = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const listener = () => (focused.current = true);
    element.addEventListener("mouseenter", listener);
    return () => element.removeEventListener("mouseenter", listener);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const listener = () => (focused.current = false);
    element.addEventListener("mouseleave", listener);
    return () => element.removeEventListener("mouseleave", listener);
  }, []);

  useEffect(() => {
    const listener = ({ code }: KeyboardEvent) => {
      if (!focused.current) return;
      if (useAppStore.getState().isEditable) return;

      if (code === "ArrowLeft" && onPrev) onPrev();
      if (code === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [onPrev, onNext]);

  return ref;
};

export const useWheelNavigation = <T extends HTMLElement = HTMLDivElement>(
  onPrev?: () => void,
  onNext?: () => void
) => {
  const ref = useRef<T | null>(null);
  const focused = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const listener = () => (focused.current = true);
    element.addEventListener("mouseenter", listener);
    return () => element.removeEventListener("mouseenter", listener);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const listener = () => (focused.current = false);
    element.addEventListener("mouseleave", listener);
    return () => element.removeEventListener("mouseleave", listener);
  }, []);

  useEffect(() => {
    const listener = throttle(({ deltaY }: WheelEvent) => {
      if (!focused.current) return;
      if (useAppStore.getState().isEditable) return;

      if (deltaY < 0 && onPrev) onPrev();
      if (deltaY > 0 && onNext) onNext();
    }, 1000);
    window.addEventListener("wheel", listener);
    return () => window.removeEventListener("wheel", listener);
  }, [onPrev, onNext]);

  return ref;
};
