import { useMemo } from "react";
import useSWR from "swr";

import { type LocalProfile, usePersistStore } from "@/store/persist";

import { executeBase } from "./execute";
import { addSSHKeyPair, startSSHAgent } from "./ssh";

const execute = async (args?: string | string[]) =>
  await executeBase("git", args);

export const isGitAvailable = async () => {
  try {
    await execute(["-v"]);
    return true;
  } catch (error) {
    return false;
  }
};

export const getGitName = async () => await execute(["config", "user.name"]);
export const getGitEmail = async () => await execute(["config", "user.email"]);

const setGlobalConfigValue = async (key: string, value: string) =>
  await execute(["config", "--global", "--replace-all", key, value]);
const unsetGlobalConfigValue = async (key: string) =>
  await execute(["config", "--global", "--unset-all", key]);

export const setName = async (name: string) =>
  await setGlobalConfigValue("user.name", name);

export const setEmail = async (email: string) =>
  await setGlobalConfigValue("user.email", email);

export const setSigningKey = async (secretId: string) =>
  await setGlobalConfigValue("user.signingkey", secretId);
export const removeSigningKey = async () =>
  await unsetGlobalConfigValue("user.signingkey");

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
        await setAutosign(false);
      }

      if (profile.ssh) {
        await addSSHKeyPair(profile.ssh.private);
        await startSSHAgent();
      }

      finishSync("local");
      return profile;
    },
    { revalidateOnFocus: false, revalidateOnMount: false }
  );
};
