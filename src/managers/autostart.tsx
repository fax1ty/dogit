import { useEffect } from "react";
import { enable } from "tauri-plugin-autostart-api";

export const Autostart = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) enable();
  }, []);

  return null;
};
