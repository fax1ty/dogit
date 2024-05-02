import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { removeSigningKey, setAutosign } from "@/api/git";
import { listGPGKeys, removeGPGKey } from "@/api/github";
import { deleteGPGKey } from "@/api/gpg";
import { ActionButton } from "@/components/buttons/action";
import { getProfileById, type Profile, usePersistStore } from "@/store/persist";

import { GenericActionNotificationContent } from "../action";
import { BaseNotificationBody } from "../base";

interface Props {
  userId: Profile["user"]["id"];
  toastId: string;
  onClose?: () => void;
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
        ? T("notifications.gpg.remove.button.in_progress")
        : T("notifications.gpg.remove.button.default")}
    </ActionButton>
  );
};

export const RemoveGPGNotification = ({ toastId, userId, onClose }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const setGPGKey = usePersistStore((state) => state.setGPGKey);

  const onClick = async () => {
    setInProgress(true);

    const profile = getProfileById(userId);

    if (!profile) {
      setInProgress(false);
      return;
    }

    try {
      await removeSigningKey();
      await setAutosign(false);

      if (profile.type === "github") {
        const keys = await listGPGKeys(profile.user.accessToken);
        const gpg = keys.find(({ key_id }) => key_id === profile.gpg);
        if (!gpg) throw new Error("No such GPG key");
        await removeGPGKey(profile.user.accessToken, gpg.id);
      }

      await deleteGPGKey(profile.user.email);
      setGPGKey(profile.user.id, false);

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
        title={T("notifications.gpg.remove.title")}
        description={T("notifications.gpg.remove.description")}
      >
        <GPGActionButton onClick={onClick} inProgress={inProgress} />
      </GenericActionNotificationContent>
    </BaseNotificationBody>
  );
};
