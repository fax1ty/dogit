import { useEffect, useRef } from "react";

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const getScrollPercent = <T extends HTMLElement>(scroller: T) => {
  const width = scroller.clientWidth;
  const scrollWidth = scroller.scrollWidth - width;
  const scrollLeft = scroller.scrollLeft;
  const percent = scrollLeft / scrollWidth;
  return percent;
};

export const useVirtualScroll = () => {
  const handleRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const active = useRef(false);
  const handleWidth = useRef(0);
  const barWidth = useRef(0);
  const offset = useRef(0);

  const updateOffset = (newOffset: number, duration = 0) => {
    if (!handleRef.current) return false;
    const handle = handleRef.current;
    offset.current = clamp(
      newOffset,
      0,
      barWidth.current - handleWidth.current
    );
    handle.style.transform = `translateX(${offset.current.toFixed(0)}px)`;
    if (duration) handle.style.transition = `all ${duration}ms ease`;

    const timeout = setTimeout(() => {
      handle.style.transition = "unset";
    }, duration);
    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    if (!handleRef.current) return;
    const handle = handleRef.current;
    const listener = () => (active.current = true);
    handle.addEventListener("mousedown", listener);
    return () => handle.removeEventListener("mousedown", listener);
  }, []);

  useEffect(() => {
    const listener = () => (active.current = false);
    window.addEventListener("mouseup", listener);
    return () => window.removeEventListener("mouseup", listener);
  }, []);

  useEffect(() => {
    let clear: (() => void) | false;
    const listener = ({ movementX }: MouseEvent) => {
      if (!active.current || !scrollableRef.current) return;
      clear = updateOffset(offset.current + movementX);
      const percentage =
        offset.current / (barWidth.current - handleWidth.current);
      const x =
        percentage *
        (scrollableRef.current.scrollWidth - scrollableRef.current.clientWidth);
      scrollableRef.current.scrollTo(x, 0);
    };
    window.addEventListener("mousemove", listener);
    return () => {
      window.removeEventListener("mousemove", listener);
      if (clear) clear();
    };
  }, []);

  useEffect(() => {
    let clear: (() => void) | false;
    if (!scrollableRef.current) return;
    const scrollable = scrollableRef.current;
    const listener = ({ deltaY }: WheelEvent) => {
      scrollable.scrollBy(deltaY, 0);
      const percentage = getScrollPercent(scrollable);
      clear = updateOffset(
        percentage * barWidth.current - handleWidth.current,
        200
      );
    };
    scrollable.addEventListener("wheel", listener);
    return () => {
      scrollable.removeEventListener("wheel", listener);
      if (clear) clear();
    };
  }, []);

  useEffect(() => {
    if (!handleRef.current) return;
    const { width } = handleRef.current.getBoundingClientRect();
    handleWidth.current = width;
  }, []);

  useEffect(() => {
    if (!barRef.current) return;
    const { width } = barRef.current.getBoundingClientRect();
    barWidth.current = width;
  }, []);

  useEffect(() => {
    if (!scrollableRef.current) return;
    scrollableRef.current.style.overflow = "hidden";
  }, []);

  return [scrollableRef, handleRef, barRef] as const;
};
