import { useEffect } from "react";
import { ToastBar, Toaster } from "react-hot-toast";
import { Talkr } from "talkr";
import { enable } from "tauri-plugin-autostart-api";

import { en } from "./i18n/en";
import { ru } from "./i18n/ru";
import { DeepLinks } from "./managers/deeplinks";
import { Focuser } from "./managers/focuser";
import { Notifications } from "./managers/notifications";
import { Resizer } from "./managers/resizer";

export const App = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) enable();
  }, []);

  return (
    <Talkr languages={{ ru, en }} defaultLanguage="en" detectBrowserLanguage>
      <DeepLinks />
      <Resizer />
      <Focuser />
      <Notifications />

      {/* https://github.com/timolins/react-hot-toast/issues/293 */}
      <Toaster
        containerClassName="toasts"
        containerStyle={{
          inset: 0,
        }}
        position="bottom-left"
        reverseOrder={false}
        gutter={20}
        toastOptions={{ duration: Infinity }}
      >
        {(t) => (
          <ToastBar
            style={{
              background: "none",
              color: "unset",
              lineHeight: "unset",
              boxShadow: "unset",
              padding: 0,
              borderRadius: 0,
              maxWidth: "unset",
              width: "100%",
            }}
            toast={t}
          >
            {({ message }) => <div className="tracer">{message}</div>}
          </ToastBar>
        )}
      </Toaster>
    </Talkr>
  );
};
