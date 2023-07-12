import { toast } from "react-hot-toast";

import { getGithubProfile } from "../api/github";
import { useTauriEvent } from "../hooks/tauri/events";
import { ManagerNotification } from "../notifications/manager";
import { useAppStore } from "../store/app";
import { usePersistStore } from "../store/persist";

export const DeepLinks = () => {
  const setGitlabImportInProgress = useAppStore(
    (state) => state.setGitlabImportInProgress
  );
  const setGithubImportInProgress = useAppStore(
    (state) => state.setGithubImportInProgress
  );
  const addProfile = usePersistStore((state) => state.addProfile);
  const setFirstTime = usePersistStore((state) => state.setFirstTime);

  // https://github.com/tauri-apps/tauri/issues/323
  useTauriEvent<string>("scheme-request-received", async ({ payload: url }) => {
    const { searchParams: query } = new URL(url);

    if (url.startsWith("dogit://oauth/github")) {
      const accessToken = query.get("accessToken");
      if (!accessToken) return;
      const { data } = await getGithubProfile(accessToken);
      addProfile("github", {
        accessToken,
        avatar: data.avatar_url,
        email: data.email,
        id: data.id,
        name: data.name,
      });
      setGithubImportInProgress(false);
      setFirstTime(false);
      toast.dismiss("import");
      toast.dismiss("intro");
      toast(<ManagerNotification />, { id: "manager" });
    }

    if (url.startsWith("dogit://oauth/gitlab")) {
      const accessToken = query.get("accessToken");
      const refreshToken = query.get("refreshToken");
      if (!accessToken || !refreshToken) return;
      console.log(accessToken, refreshToken);
      setGitlabImportInProgress(false);
    }
  });

  return null;
};
