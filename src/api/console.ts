import { invoke } from "@tauri-apps/api/core";

export const log = async (...parts: unknown[]) => {
  await invoke("print", {
    msg: parts.map((v) => JSON.stringify(v)).join(", "),
  });
};
