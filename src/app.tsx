import { ToastBar, Toaster } from "react-hot-toast";
import { Talkr } from "talkr";

import { en } from "./i18n/en";
import { ru } from "./i18n/ru";
import { Autostart } from "./managers/autostart";
import { DeepLinks } from "./managers/deeplinks";
import { Focuser } from "./managers/focuser";
import { NoContext } from "./managers/no-context";
import { Notifications } from "./managers/notifications";
import { Resizer } from "./managers/resizer";
import { Syncronizer } from "./managers/syncronizer";

export const App = () => {
  return (
    <Talkr languages={{ ru, en }} defaultLanguage="en" detectBrowserLanguage>
      <Syncronizer />
      <DeepLinks />
      <Resizer />
      <NoContext />
      <Focuser />
      <Autostart />
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
