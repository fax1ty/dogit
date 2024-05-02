import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { listSSHKeys, removeSSHKey } from "@/api/github";
import { removeSSHKeyFromKeychain } from "@/api/ssh";
import { ActionButton } from "@/components/buttons/action";
import { getProfileById, type Profile, usePersistStore } from "@/store/persist";

import { GenericActionNotificationContent } from "../action";
import { BaseNotificationBody } from "../base";

interface Props {
  userId: Profile["user"]["id"];
  toastId: string;
  onClose?: () => void;
}

const SSHActionButton = ({
  onClick,
  inProgress,
}: {
  onClick: () => void;
  inProgress: boolean;
}) => {
  const { T } = useT();

  return (
    <ActionButton loading={inProgress} onClick={onClick}>
      {inProgress
        ? T("notifications.ssh.remove.button.in_progress")
        : T("notifications.ssh.remove.button.default")}
    </ActionButton>
  );
};

export const RemoveSSHNotification = ({ toastId, userId, onClose }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const unsetSSHKey = usePersistStore((state) => state.unsetSSHKey);

  const onClick = async () => {
    setInProgress(true);

    const profile = getProfileById(userId);

    if (!profile) {
      setInProgress(false);
      return;
    }

    try {
      await removeSSHKeyFromKeychain();

      if (profile.type === "github" && profile.ssh) {
        const [algorithm, pub] = profile.ssh.public.split(" ");
        const keys = await listSSHKeys(profile.user.accessToken);
        const key = keys.find(({ key }) => key === `${algorithm} ${pub}`);
        if (!key) throw new Error("No such SSH key");
        await removeSSHKey(profile.user.accessToken, key.id);
      }

      unsetSSHKey(userId);

      if (onClose) onClose();
      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);
    } finally {
      setInProgress(false);
    }
  };

  const { T } = useT();

  return (
    <BaseNotificationBody>
      <GenericActionNotificationContent
        title={T("notifications.ssh.remove.title")}
        description={T("notifications.ssh.remove.description")}
      >
        <SSHActionButton onClick={onClick} inProgress={inProgress} />
      </GenericActionNotificationContent>
    </BaseNotificationBody>
  );
};
