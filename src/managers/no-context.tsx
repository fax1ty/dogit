import { useEffect } from "react";

export const NoContext = () => {
  useEffect(() => {
    if (import.meta.env.DEV) return;
    const listener = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", listener);
    return () => {
      document.removeEventListener("contextmenu", listener);
    };
  }, []);

  return null;
};
