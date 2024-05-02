import { Window } from "@tauri-apps/api/window";
import { useEffect } from "react";

export const Focuser = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const listener = async () => {
      const appWindow = new Window("main");
      await appWindow.setFocus();
    };
    root.addEventListener("mouseenter", listener);
    return () => {
      root.removeEventListener("mouseenter", listener);
    };
  }, []);

  // ? Can't remove the focus until such an opportunity appears
  // https://github.com/tauri-apps/tauri/issues/7331
  //   useEffect(() => {
  //     const root = document.getElementById("root");
  //     if (!root) return;
  //     const listener = async () => await appWindow.removeFocus();
  //     root.addEventListener("mouseleave", listener);
  //     return () => root.removeEventListener("mouseleave", listener);
  //   }, []);

  return null;
};
