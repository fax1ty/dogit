import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { addSSHKey } from "../../api/github";
import {
  addSSHKeyPair,
  generateSSHKeyPair,
  startSSHAgent,
} from "../../api/ssh";
import { ActionButton } from "../../components/buttons/action";
import { getProfileById, Profile, usePersistStore } from "../../store/persist";
import { GenericActionNotificationContent } from "../action";
import { BaseNotificationBody } from "../base";

interface Props {
  userId: Profile["user"]["id"];
  toastId: string;
  onClose: () => void;
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
        ? T("notifications.ssh.add.button.in_progress")
        : T("notifications.ssh.add.button.default")}
    </ActionButton>
  );
};

export const AddSSHNotification = ({ toastId, userId, onClose }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const setSSHKey = usePersistStore((state) => state.setSSHKey);

  const onClick = async () => {
    setInProgress(true);

    const profile = getProfileById(userId);

    if (!profile) return setInProgress(false);

    try {
      const { public_key, private_key } = await generateSSHKeyPair(
        profile.user.email
      );
      await addSSHKeyPair(private_key);
      await startSSHAgent();
      if (profile.type === "github")
        await addSSHKey(profile.user.accessToken, public_key);

      setSSHKey(profile.user.id, public_key, private_key);

      onClose();
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
        title={T("notifications.ssh.add.title")}
        description={T("notifications.ssh.add.description")}
      >
        <SSHActionButton onClick={onClick} inProgress={inProgress} />
      </GenericActionNotificationContent>
    </BaseNotificationBody>
  );
};
