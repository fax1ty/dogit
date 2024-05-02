import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BaseProfile<
  T extends keyof ProfileTypes,
  U extends { id: string | number },
  R extends boolean,
> {
  selected: boolean;
  colors: [string, string, string];
  gpg: string | false;
  ssh: { private: string; public: string } | false;
  remote: R;
  user: U;
  type: T;
  sync: {
    inProgress: boolean;
    lastSyncTime: number;
  };
}

export interface GitlabUser {
  avatar: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  id: string;
}

export type GitlabProfile = BaseProfile<"gitlab", GitlabUser, true>;

export interface GithubUser {
  avatar: string;
  name: string;
  email: string;
  accessToken: string;
  id: number;
}

export type GithubProfile = BaseProfile<"github", GithubUser, true>;

export interface LocalUser {
  name: string;
  email: string;
  id: "local";
}

export type LocalProfile = BaseProfile<"local", LocalUser, false>;

interface ProfileTypes {
  local: LocalProfile;
  gitlab: GitlabProfile;
  github: GithubProfile;
}
export type Profile = ProfileTypes[keyof ProfileTypes];
type GetProfileType<T extends Profile["type"]> = ProfileTypes[T];

interface PersistStore {
  profiles: Profile[];
  selectedId: Profile["user"]["id"] | null;
  addProfile: <
    T extends Profile["type"],
    P extends GetProfileType<T>,
    U extends P["user"],
  >(
    t: T,
    u: U
  ) => void;
  updateProfileUser: <T extends Profile["user"]>(
    id: T["id"],
    mutation: (v: T) => T
  ) => void;
  removeProfile: (id: Profile["user"]["id"]) => void;
  selectProfile: (i: number) => void;
  lastVersion: string | null;
  setLastVersion: (v: string) => void;
  isFirstTime: boolean;
  setFirstTime: (v: boolean) => void;
  startSync: (id: Profile["user"]["id"]) => void;
  finishSync: (id: Profile["user"]["id"]) => void;
  setGPGKey: (id: Profile["user"]["id"], secretId: string | false) => void;
  setSSHKey: (id: Profile["user"]["id"], pub: string, priv: string) => void;
  unsetSSHKey: (id: Profile["user"]["id"]) => void;
  skippedVersions: string[];
  skipVersion: (v: string) => void;
}

const COLORS = [
  ["#000AFF", "#DB00FF", "#00A3FF"],
  ["#f2371f", "#EE46D3", "#907CFF"],
  ["#f2371f", "#FFC700", "#f2371f"],
  ["#1BC47D", "#907CFF", "#EE46D3"],
  ["#18A0FB", "#00c5df", "#000AFF"],
  ["#FFC700", "#EE46D3", "#f2371f"],
  ["#00bc88", "#00ff84", "#009456"],
  ["#020710", "#1356bb", "#1a75ff"],
] as [string, string, string][];
const randomColorSet = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const usePersistStore = create(
  persist<PersistStore>(
    (set, get) => ({
      isFirstTime: true,
      setFirstTime: (v) => {
        set({ isFirstTime: v });
      },
      lastVersion: null,
      setLastVersion: (v) => {
        set({ lastVersion: v });
      },
      profiles: [],
      selectedId: null,
      addProfile: (type, user) => {
        const userAlreadyExist = get().profiles.find(
          ({ user: { id } }) => id === user.id
        );
        if (userAlreadyExist) return;
        set((old) => ({
          profiles: [
            ...old.profiles,
            {
              type,
              ssh: false,
              gpg: false,
              remote: (type !== "local") as any,
              user: user as any,
              selected: false,
              colors: randomColorSet(),
              sync: {
                inProgress: false,
                lastSyncTime: Date.now(),
              },
            },
          ],
        }));
        get().selectProfile(get().profiles.length - 1);
      },
      removeProfile: (id) => {
        set((old) => ({
          profiles: old.profiles.filter(({ user }) => user.id !== id),
        }));
      },
      selectProfile: (i) => {
        set((old) => {
          const profiles = [...old.profiles];
          const oldSelectedIdx = profiles.findIndex(({ selected }) => selected);
          if (profiles[oldSelectedIdx])
            profiles[oldSelectedIdx].selected = false;
          const profile = profiles[i];
          profile.selected = true;

          return { profiles, selectedId: profile.user.id };
        });
      },
      updateProfileUser: (id, mutation) => {
        set((old) => {
          const profiles = [...old.profiles];
          const idx = profiles.findIndex(({ user }) => user.id === id);
          const updatedUser = mutation(
            profiles[idx].user as ReturnType<typeof mutation>
          );
          profiles[idx].user = updatedUser;
          return { profiles };
        });
      },
      setGPGKey: (id, secretId) => {
        set((old) => {
          const profiles = [...old.profiles];
          const idx = profiles.findIndex(({ user }) => user.id === id);
          profiles[idx].gpg = secretId;
          return { profiles };
        });
      },
      setSSHKey: (id, pub, secret) => {
        set((old) => {
          const profiles = [...old.profiles];
          const idx = profiles.findIndex(({ user }) => user.id === id);
          profiles[idx].ssh = { public: pub, private: secret };
          return { profiles };
        });
      },
      unsetSSHKey: (id) => {
        set((old) => {
          const profiles = [...old.profiles];
          const idx = profiles.findIndex(({ user }) => user.id === id);
          profiles[idx].ssh = false;
          return { profiles };
        });
      },
      startSync: (id) => {
        set((old) => {
          const profiles = [...old.profiles];
          const idx = profiles.findIndex(({ user }) => user.id === id);
          profiles[idx].sync.inProgress = true;
          return { profiles };
        });
      },
      finishSync: (id) => {
        set((old) => {
          const profiles = [...old.profiles];
          const idx = profiles.findIndex(({ user }) => user.id === id);
          profiles[idx].sync.inProgress = false;
          profiles[idx].sync.lastSyncTime = Date.now();
          return { profiles };
        });
      },
      skippedVersions: [],
      skipVersion: (v) => {
        set((old) => ({ skippedVersions: [...old.skippedVersions, v] }));
      },
    }),
    { name: "persist-store", version: 6 }
  )
);

export const getProfileById = (id: Profile["user"]["id"]) => {
  const profiles = usePersistStore.getState().profiles;
  const profile = profiles.find(({ user }) => id === user.id);
  return profile;
};
