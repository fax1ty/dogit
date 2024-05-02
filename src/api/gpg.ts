import { executeBase } from "./execute";

const execute = async (args?: string | string[]) =>
  await executeBase("gpg", args);

export const isGPGAvailable = async () => {
  try {
    await execute(["--version"]);
    return true;
  } catch (error) {
    return false;
  }
};

export const generateGPGKey = async (name: string, email: string) => {
  await execute([
    "--batch",
    "--default-new-key-algo",
    "ed25519/cert,sign+cv25519/encr",
    "--quick-generate-key",
    `${name} (Generated by Dogit) <${email}>`,
  ]);
  const output = await getSecretKey(email);
  const regex = output.match(/sec\s*\S*\/(\S*)/);
  if (!regex) throw new Error("No list regex");
  const id = regex[1];
  if (!id) throw new Error("No secret key id in regex");
  return id;
};

export const getGPGSecretKeyFingerprint = async (uid: string) => {
  const output = await getSecretKey(uid);
  const regex = output.match(/sec.*\n\s*(.*)\n/);
  if (!regex) throw new Error("No list regex");
  const fingerprint = regex[1];
  if (!fingerprint) throw new Error("No secret key fingerprint in regex");
  return fingerprint;
};

export const deleteGPGKey = async (uid: string) => {
  const fingerprint = await getGPGSecretKeyFingerprint(uid);
  await execute(["--batch", "--yes", "--delete-secret-keys", fingerprint]);
  await execute(["--batch", "--yes", "--delete-key", uid]);
};

export const listSecretKeys = async () =>
  await execute(["--keyid-format=long", "-K"]);
export const getSecretKey = async (uid: string) =>
  await execute(["--keyid-format=long", "-K", uid]);

export const exportArmoredPubKey = async (uid: string) =>
  await execute(["--armor", "--export", uid]);
