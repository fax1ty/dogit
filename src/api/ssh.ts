import { invoke } from "@tauri-apps/api/core";

import { executeBase } from "./execute";

const ssh = async (args?: string | string[]) => await executeBase("ssh", args);

export const isSSHAvailable = async () => {
  try {
    await ssh("-V");
    return true;
  } catch (error) {
    return false;
  }
};

export const generateSSHKeyPair = async (email: string) => {
  const pair = await invoke<{ private_key: string; public_key: string }>(
    "generate_ssh_keys",
    { email }
  );
  return pair;
};

export const addSSHKeyPair = async (key: string) =>
  await invoke<string>("write_ssh_key", { key });

export const startSSHAgent = async () =>
  await executeBase("cmd.exe", ["/c", "start-ssh-agent"], {
    encoding: "utf-8",
  });

export const removeSSHKeyFromKeychain = async () =>
  await invoke("remove_ssh_key");
