import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { setAutosign, setSigningKey } from "../../api/git";
import { addGPGKey } from "../../api/github";
import { exportArmoredPubKey, generateGPGKey } from "../../api/gpg";
import { ActionButton } from "../../components/buttons/action";
import { Profile, usePersistStore } from "../../store/persist";
import { GenericActionNotificationBody } from "../action";

interface Props {
  id: Profile["user"]["id"];
  toastId: string;
  onClose: () => void;
}

const GPGActionButton = ({
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
        ? T("notifications.gpg.add.button.in_progress")
        : T("notifications.gpg.add.button.default")}
    </ActionButton>
  );
};

export const AddGPGNotification = ({ toastId, id, onClose }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const setGPGKey = usePersistStore((state) => state.setGPGKey);

  const onClick = async () => {
    setInProgress(true);

    const profiles = usePersistStore.getState().profiles;
    const profile = profiles.find(({ user }) => id === user.id);

    if (!profile) {
      return setInProgress(false);
    }

    try {
      const secretId = await generateGPGKey(
        profile.user.name,
        profile.user.email
      );
      const pub = await exportArmoredPubKey(profile.user.email);
      if (profile.type === "github")
        await addGPGKey(profile.user.accessToken, pub);
      await setSigningKey(secretId);
      await setAutosign(true);
      setGPGKey(profile.user.id, secretId);

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
      title={T("notifications.gpg.add.title")}
      description={
        inProgress
          ? T("notifications.gpg.add.description.in_progress")
          : T("notifications.gpg.add.description.default")
      }
    >
      <GPGActionButton onClick={onClick} inProgress={inProgress} />
    </GenericActionNotificationBody>
  );
};
