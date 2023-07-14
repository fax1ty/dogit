import { FastForward } from "@phosphor-icons/react";
import { relaunch } from "@tauri-apps/api/process";
import { installUpdate } from "@tauri-apps/api/updater";
import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import {
  ActionButton,
  ActionButtonProps,
} from "../../components/buttons/action";
import { usePersistStore } from "../../store/persist";
import { GenericActionNotificationBody } from "../action";

interface Props {
  version: string;
  toastId: string;
}

const InstallActionButton = (props: ActionButtonProps) => {
  const { T } = useT();

  return (
    <ActionButton {...props}>
      {T("notifications.updater.buttons.install")}
    </ActionButton>
  );
};

const SkipActionButton = (props: ActionButtonProps) => {
  const { T } = useT();

  return (
    <ActionButton {...props} icon={FastForward}>
      {T("notifications.updater.buttons.skip")}
    </ActionButton>
  );
};

export const UpdaterNotification = ({ version, toastId }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const skipVersion = usePersistStore((state) => state.skipVersion);

  const onClick = async () => {
    setInProgress(true);
    await installUpdate();
    await relaunch();
    setInProgress(false);
  };
  const onSkip = () => {
    skipVersion(version);
    toast.dismiss(toastId);
  };

  const { T } = useT();

  return (
    <GenericActionNotificationBody
      title={T("notifications.updater.title")}
      description={T("notifications.updater.description", { version })}
    >
      <InstallActionButton onClick={onClick} loading={inProgress} />
      <SkipActionButton onClick={onSkip} disabled={inProgress} />
    </GenericActionNotificationBody>
  );
};
