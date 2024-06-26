import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";

import {
  type GithubProfile,
  type GithubUser,
  usePersistStore,
} from "@/store/persist";

import { setAutosign, setEmail, setName, setSigningKey } from "./git";
import { addSSHKeyPair, startSSHAgent } from "./ssh";

const fetcher = axios.create({
  baseURL: "https://api.github.com",
  headers: { "X-GitHub-Api-Version": "2022-11-28" },
});

interface GithubProfileResponse {
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export const getGithubProfile = async (
  accessToken: GithubProfile["user"]["accessToken"]
) =>
  await fetcher.get<GithubProfileResponse>("/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const useGithubProfile = (
  id: GithubUser["id"],
  accessToken: GithubProfile["user"]["accessToken"]
) => {
  const profiles = usePersistStore((state) => state.profiles);
  const startSync = usePersistStore((state) => state.startSync);
  const finishSync = usePersistStore((state) => state.finishSync);

  const profile = useMemo(
    () =>
      profiles.find(
        ({ user, type }) => id === user.id && type === "github"
      ) as GithubProfile,
    [profiles, id]
  );
  const selected = useMemo(() => {
    if (!profile) return false;
    return profile.selected;
  }, [profile]);

  return useSWR(
    [selected ? `/github-profile/${id}` : null, accessToken],
    async ([, accessToken]) => {
      if (!profile) return;

      startSync(id);

      const { data } = await getGithubProfile(accessToken);
      await setName(data.name);
      await setEmail(data.email);

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

      finishSync(id);
      return data;
    },
    { revalidateOnFocus: false, revalidateOnMount: false }
  );
};

interface GithubGPGKeyResponse {
  id: number;
  name: string;
  primary_key_id: number;
  key_id: string;
  public_key: string;
  emails: Array<{
    email: string;
    verified: boolean;
  }>;
  subkeys: Array<{
    id: number;
    primary_key_id: number;
    key_id: string;
    public_key: string;
    emails: string[];
    can_sign: boolean;
    can_encrypt_comms: boolean;
    can_encrypt_storage: boolean;
    can_certify: boolean;
    created_at: string;
    expires_at: string;
    revoked: boolean;
  }>;
  can_sign: boolean;
  can_encrypt_comms: boolean;
  can_encrypt_storage: boolean;
  can_certify: boolean;
  created_at: string;
  expires_at: string;
  revoked: boolean;
  raw_key: string;
}

export const addGPGKey = async (
  accessToken: GithubProfile["user"]["accessToken"],
  pub: string
) =>
  await fetcher.post<GithubGPGKeyResponse>(
    "/user/gpg_keys",
    { name: "Generated by Dogit", armored_public_key: pub },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export const listGPGKeys = async (
  accessToken: GithubProfile["user"]["accessToken"]
) => {
  const { data } = await fetcher.get<GithubGPGKeyResponse[]>(`/user/gpg_keys`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const removeGPGKey = async (
  accessToken: GithubProfile["user"]["accessToken"],
  id: GithubGPGKeyResponse["id"]
) =>
  await fetcher.delete(`/user/gpg_keys/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

interface GitHubSSHKeyResponse {
  key: string;
  id: number;
  url: string;
  title: string;
  created_at: string;
  verified: boolean;
  read_only: boolean;
}

export const addSSHKey = async (
  accessToken: GithubProfile["user"]["accessToken"],
  pub: string
) =>
  await fetcher.post<GitHubSSHKeyResponse>(
    "/user/keys",
    { title: "Generated by Dogit", key: pub },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export const listSSHKeys = async (
  accessToken: GithubProfile["user"]["accessToken"]
) => {
  const { data } = await fetcher.get<GitHubSSHKeyResponse[]>("/user/keys", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const removeSSHKey = async (
  accessToken: GithubProfile["user"]["accessToken"],
  id: GitHubSSHKeyResponse["id"]
) =>
  await fetcher.delete(`/user/keys/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
