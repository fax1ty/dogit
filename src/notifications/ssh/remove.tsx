import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { removeSSHKeyFromKeychain } from "../../api/ssh";
import { ActionButton } from "../../components/buttons/action";
import { Profile, usePersistStore } from "../../store/persist";
import { GenericActionNotificationBody } from "../action";

interface Props {
  id: Profile["user"]["id"];
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
        ? T("notifications.ssh.remove.button.in_progress")
        : T("notifications.ssh.remove.button.default")}
    </ActionButton>
  );
};

export const RemoveSSHNotification = ({ toastId, id, onClose }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const setSSHKey = usePersistStore((state) => state.setSSHKey);

  const onClick = async () => {
    setInProgress(true);

    const profiles = usePersistStore.getState().profiles;
    const profile = profiles.find(({ user }) => id === user.id);

    if (!profile || !profile.ssh) {
      return setInProgress(false);
    }

    try {
      await removeSSHKeyFromKeychain();

      //!404
      // if (profile.type === "github") {
      //   const [algorithm, pub] = profile.ssh.split(" ");
      //   const keys = await listSSHKeys(profile.user.accessToken);
      //   const key = keys.find(({ key }) => key === `${algorithm} ${pub}`);
      //   if (!key) throw new Error("No such SSH key");
      //   await removeSSHKey(profile.user.accessToken, key.id);
      // }

      setSSHKey(profile.user.id, false);

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
    <GenericActionNotificationBody
      title={T("notifications.ssh.remove.title")}
      description={T("notifications.ssh.remove.description")}
    >
      <SSHActionButton onClick={onClick} inProgress={inProgress} />
    </GenericActionNotificationBody>
  );
};
