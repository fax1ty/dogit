import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { removeSigningKey, setAutosign } from "../../api/git";
import { deleteGPGKey } from "../../api/gpg";
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

export const RemoveGPGNotification = ({ toastId, id, onClose }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const setGPGKey = usePersistStore((state) => state.setGPGKey);

  const onClick = async () => {
    setInProgress(true);

    const profiles = usePersistStore.getState().profiles;
    const profile = profiles.find(({ user }) => id === user.id);

    if (!profile || !profile.gpg) {
      return setInProgress(false);
    }

    try {
      await removeSigningKey();
      await setAutosign(false);
      //! 404
      //   const keys = await listGPGKeys(profile.user.accessToken);
      //   const gpg = keys.find(({ key_id }) => key_id === profile.gpg);
      //   if (!gpg) throw new Error("No such GPG key");
      //   await removeGPGKey(profile.user.accessToken, gpg.id);
      await deleteGPGKey(profile.user.email);
      setGPGKey(profile.user.id, false);

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
      title={T("notifications.gpg.remove.title")}
      description={T("notifications.gpg.remove.description")}
    >
      <GPGActionButton onClick={onClick} inProgress={inProgress} />
    </GenericActionNotificationBody>
  );
};
