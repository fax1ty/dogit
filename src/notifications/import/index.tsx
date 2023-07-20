import {
  FloppyDiskBack,
  GithubLogo,
  // GitlabLogoSimple,
} from "@phosphor-icons/react";
import { open } from "@tauri-apps/api/shell";
import { logEvent } from "firebase/analytics";
import { createElement, useMemo } from "react";
import { useT } from "talkr";

import { getGitEmail, getGitName } from "../../api/git";
import { Button } from "../../components/buttons/default";
import { Typography } from "../../components/typography";
import { useVirtualScroll } from "../../hooks/scrollbar";
import { analytics } from "../../main";
import { useAppStore } from "../../store/app";
import { usePersistStore } from "../../store/persist";
import { BaseNotificationBody } from "../base";
import classes from "./styles.module.scss";

interface Props {
  onClose?: () => void;
}

const ImportNotificationContent = ({ onClose }: Props) => {
  const { T } = useT();

  // const isGitlabImportInProgress = useAppStore(
  //   (state) => state.isGitlabImportInProgress
  // );
  // const setGitlabImportInProgress = useAppStore(
  //   (state) => state.setGitlabImportInProgress
  // );
  const isGithubImportInProgress = useAppStore(
    (state) => state.isGithubImportInProgress
  );
  const setGithubImportInProgress = useAppStore(
    (state) => state.setGithubImportInProgress
  );

  const addProfile = usePersistStore((state) => state.addProfile);
  const profiles = usePersistStore((state) => state.profiles);

  const buttons = useMemo(() => {
    const buttons = [];

    buttons.push({
      title: T("notifications.import.buttons.github"),
      icon: GithubLogo,
      onClick: async () => {
        if (isGithubImportInProgress) setGithubImportInProgress(false);
        else {
          await open(`${import.meta.env.VITE_API_URL}/oauth/github/start`);
          setGithubImportInProgress(true);
        }
      },
      loading: isGithubImportInProgress,
    });

    // {
    //   title: "Импортировать профиль GitLab",
    //   icon: GitlabLogoSimple,
    //   onClick: async () => {
    //     if (isGitlabImportInProgress) setGitlabImportInProgress(false);
    //     else {
    //       await open(`${import.meta.env.VITE_API_URL}/oauth/gitlab/start`);
    //       setGitlabImportInProgress(true);
    //     }
    //   },
    //   loading: isGitlabImportInProgress,
    // },

    const localProfileExist = Boolean(
      profiles.find(({ type }) => type === "local")
    );
    buttons.push({
      title: T("notifications.import.buttons.local"),
      icon: FloppyDiskBack,
      onClick: async () =>
        addProfile("local", {
          id: "local",
          name: await getGitName(),
          email: await getGitEmail(),
        }),
      disabled: localProfileExist,
    });

    return buttons;
  }, [
    T,
    isGithubImportInProgress,
    profiles,
    setGithubImportInProgress,
    addProfile,
  ]);

  const [scrollable, handle, bar] = useVirtualScroll();

  return (
    <div className={classes.content}>
      <div className={classes.fake} />
      <div className={classes.scrollbar} ref={bar}>
        <div className={classes.handle} ref={handle} />
      </div>

      <div ref={scrollable} className={classes.container}>
        {buttons.map(({ title, icon, loading, onClick, disabled }, i) => (
          <Button
            key={i}
            onClick={() => {
              onClick();
              logEvent(analytics, "profile_imported");
              if (onClose) onClose();
            }}
            loading={loading}
            disabled={disabled}
          >
            {createElement(icon, {
              weight: "fill",
              size: 14,
              color: "white",
            })}
            <Typography bold>{title}</Typography>
          </Button>
        ))}
      </div>
    </div>
  );
};

export const ImportNotification = (props: Props) => {
  return (
    <BaseNotificationBody>
      <ImportNotificationContent {...props} />
    </BaseNotificationBody>
  );
};
