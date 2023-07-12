import { getVersion } from "@tauri-apps/api/app";
import { toast } from "react-hot-toast";

import { useTauriEvent } from "../hooks/tauri/events";
import { CloseNotification } from "../notifications/close";
import { IntroNotification } from "../notifications/intro";
import { ManagerNotification } from "../notifications/manager";
import { UpdateNotification } from "../notifications/update";
import { useAppStore } from "../store/app";
import { usePersistStore } from "../store/persist";

export const Notifications = () => {
  const isNotificationsCreated = useAppStore(
    (state) => state.isNotificationsCreated
  );
  const setNotificationsCreated = useAppStore(
    (state) => state.setNotificationsCreated
  );

  const profiles = usePersistStore((state) => state.profiles);
  const lastVersion = usePersistStore((state) => state.lastVersion);
  const setLastVersion = usePersistStore((state) => state.setLastVersion);
  const isFirstTime = usePersistStore((state) => state.isFirstTime);

  useTauriEvent("open", async () => {
    if (isNotificationsCreated) return;

    toast(<CloseNotification />, { id: "close" });
    const currentVersion = await getVersion();
    if (currentVersion !== lastVersion) {
      if (lastVersion)
        toast((t) => <UpdateNotification id={t.id} />, { id: "update" });
      setLastVersion(currentVersion);
    }
    if (isFirstTime && !profiles.length) {
      toast(<IntroNotification />, { id: "intro" });
    } else toast(<ManagerNotification />, { id: "manager" });

    setNotificationsCreated(true);
  });

  return null;
};
