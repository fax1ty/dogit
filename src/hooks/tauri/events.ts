import { Event, EventName, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

export const useTauriEvent = <T>(
  event: EventName,
  cb: (data: Event<T>) => void,
  clear?: () => void
) => {
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    listen<T>(event, (data) => {
      cb(data);
    }).then((fn) => (unsubscribe = fn));
    return () => {
      if (clear) clear();
      if (unsubscribe) unsubscribe();
    };
  }, [cb, clear, event]);
};

export const useTauriFocus = (cb: () => void, clear?: () => void) =>
  useTauriEvent("tauri://focus", cb, clear);

export const useTauriBlur = (cb: () => void, clear?: () => void) =>
  useTauriEvent("tauri://blur", cb, clear);
