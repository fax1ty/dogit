import { enable } from "@tauri-apps/plugin-autostart";
import { useEffect } from "react";

export const Autostart = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) void enable();
  }, []);

  return null;
};
