import { getVersion } from "@tauri-apps/api/app";
import { check as checkUpdate } from "@tauri-apps/plugin-updater";
import { toast } from "react-hot-toast";

import { useTauriEvent } from "@/hooks/tauri/events";
import { CloseNotification } from "@/notifications/close";
import { IntroNotification } from "@/notifications/intro";
import { ManagerNotification } from "@/notifications/manager";
import { UpdateNotification } from "@/notifications/update";
import { UpdaterNotification } from "@/notifications/updater";
import { useAppStore } from "@/store/app";
import { usePersistStore } from "@/store/persist";

export const Notifications = () => {
  const isNotificationsCreated = useAppStore(
    (state) => state.isNotificationsCreated
  );
  const setNotificationsCreated = useAppStore(
    (state) => state.setNotificationsCreated
  );

  const skippedVersions = usePersistStore((state) => state.skippedVersions);

  const lastVersion = usePersistStore((state) => state.lastVersion);
  const setLastVersion = usePersistStore((state) => state.setLastVersion);
  const isFirstTime = usePersistStore((state) => state.isFirstTime);

  useTauriEvent("open", async () => {
    if (isNotificationsCreated) return;

    toast(<CloseNotification />, { id: "close" });

    const currentVersion = await getVersion();
    if (
      !skippedVersions.includes(currentVersion) &&
      currentVersion !== lastVersion
    ) {
      if (lastVersion)
        toast((t) => <UpdateNotification toastId={t.id} />, { id: "update" });
      setLastVersion(currentVersion);
    }

    if (!import.meta.env.DEV) {
      try {
        const update = await checkUpdate();

        if (update) {
          toast(
            (t) => (
              <UpdaterNotification version={update.version} toastId={t.id} />
            ),
            {
              id: "updater",
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    const profiles = usePersistStore.getState().profiles;

    if (isFirstTime && profiles.length === 0) {
      toast(<IntroNotification />, { id: "intro" });
    } else toast(<ManagerNotification />, { id: "manager" });

    setNotificationsCreated(true);
  });

  return null;
};
