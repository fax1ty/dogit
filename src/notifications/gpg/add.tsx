import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { setAutosign, setSigningKey } from "../../api/git";
import { addGPGKey } from "../../api/github";
import { exportArmoredPubKey, generateGPGKey } from "../../api/gpg";
import { ActionButton } from "../../components/buttons/action";
import { getProfileById, Profile, usePersistStore } from "../../store/persist";
import { GenericActionNotificationContent } from "../action";
import { BaseNotificationBody } from "../base";
import { GenericErrorNotification } from "../error";

interface Props {
  userId: Profile["user"]["id"];
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

export const AddGPGNotification = ({ toastId, userId, onClose }: Props) => {
  const [inProgress, setInProgress] = useState(false);

  const setGPGKey = usePersistStore((state) => state.setGPGKey);

  const onClick = async () => {
    setInProgress(true);

    const profile = getProfileById(userId);

    if (!profile) return setInProgress(false);

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
      setGPGKey(userId, secretId);

      onClose();
      toast.dismiss(toastId);
    } catch (error) {
      toast((t) => (
        <GenericErrorNotification
          toastId={t.id}
          description={
            error instanceof Object &&
            "message" in error &&
            typeof error["message"] === "string"
              ? error.message
              : T("errors.gpg_add_unknown_error")
          }
        />
      ));
    } finally {
      setInProgress(false);
    }
  };

  const { T } = useT();

  return (
    <BaseNotificationBody>
      <GenericActionNotificationContent
        title={T("notifications.gpg.add.title")}
        description={
          inProgress
            ? T("notifications.gpg.add.description.in_progress")
            : T("notifications.gpg.add.description.default")
        }
      >
        <GPGActionButton onClick={onClick} inProgress={inProgress} />
      </GenericActionNotificationContent>
    </BaseNotificationBody>
  );
};
