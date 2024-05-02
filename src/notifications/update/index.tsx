import { open } from "@tauri-apps/plugin-shell";
import { useT } from "talkr";

import { usePersistStore } from "@/store/persist";

import { type AutoClosableNotificationProps } from "../autoclosable";
import { GenericInfoNotification } from "../info";

export const UpdateNotification = (props: AutoClosableNotificationProps) => {
  const lastVersion = usePersistStore((state) => state.lastVersion);

  const { T } = useT();

  return (
    <GenericInfoNotification
      {...props}
      title={T("notifications.update.title")}
      description={T("notifications.update.description", {
        version: lastVersion,
      })}
      action={async () => {
        if (lastVersion)
          await open(
            `https://github.com/fax1ty/dogit/releases/tag/v${lastVersion}`
          );
      }}
      actionText={T("notifications.update.button")}
    />
  );
};
