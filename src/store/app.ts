import { create } from "zustand";

interface AppStore {
  isNotificationsCreated: boolean;
  setNotificationsCreated: (v: boolean) => void;
  isGitlabImportInProgress: boolean;
  setGitlabImportInProgress: (v: boolean) => void;
  isGithubImportInProgress: boolean;
  setGithubImportInProgress: (v: boolean) => void;
  isEditable: boolean;
  setEditable: (v: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isNotificationsCreated: false,
  setNotificationsCreated: (v) => set({ isNotificationsCreated: v }),
  isGitlabImportInProgress: false,
  setGitlabImportInProgress: (v) => set({ isGitlabImportInProgress: v }),
  isGithubImportInProgress: false,
  setGithubImportInProgress: (v) => set({ isGithubImportInProgress: v }),
  isEditable: false,
  setEditable: (v) => set({ isEditable: v }),
}));
