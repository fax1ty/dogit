import { useMemo } from "react";
import useSWR from "swr";

import { LocalProfile, usePersistStore } from "../store/persist";
import { executeBase } from "./execute";

const execute = (args?: string | string[]) => executeBase("git", args);

export const isGitAvailable = async () => {
  try {
    await execute();
    return true;
  } catch (error) {
    return false;
  }
};

export const getGitName = () => execute(["config", "user.name"]);
export const getGitEmail = () => execute(["config", "user.email"]);

const setGlobalConfigValue = async (key: string, value: string) =>
  await execute(["config", "--global", "--replace-all", key, value]);
const unsetGlobalConfigValue = async (key: string) =>
  await execute(["config", "--global", "--unset-all", key]);

export const setName = (name: string) =>
  setGlobalConfigValue("user.name", name);

export const setEmail = async (email: string) =>
  setGlobalConfigValue("user.email", email);

export const setSigningKey = async (secretId: string) =>
  setGlobalConfigValue("user.signingkey", secretId);
export const removeSigningKey = async () =>
  unsetGlobalConfigValue("user.signingkey");

export const setAutosign = async (v: boolean) => {
  await setGlobalConfigValue("commit.gpgsign", String(v));
  await setGlobalConfigValue("tag.gpgsign", String(v));
};

export const useLocalProfile = () => {
  const profiles = usePersistStore((state) => state.profiles);
  const startSync = usePersistStore((state) => state.startSync);
  const finishSync = usePersistStore((state) => state.finishSync);

  const profile = useMemo(
    () => profiles.find(({ type }) => type === "local") as LocalProfile,
    [profiles]
  );
  const selected = useMemo(() => {
    if (!profile) return false;
    return profile.selected;
  }, [profile]);

  return useSWR(
    selected ? `/local-profile` : null,
    async () => {
      if (!profile) return;

      startSync("local");

      await setName(profile.user.name);
      await setEmail(profile.user.email);

      if (profile.gpg) {
        await setSigningKey(profile.gpg);
        await setAutosign(true);
      } else {
        //! code 5
        // await removeSigningKey();
        await setAutosign(false);
      }

      finishSync("local");
      return profile;
    },
    { refreshWhenHidden: true, refreshInterval: 5 * 60 * 1000 }
  );
};
