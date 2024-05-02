import { Gear, Trash } from "@phosphor-icons/react";
import { open } from "@tauri-apps/plugin-shell";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { removeSigningKey, setAutosign } from "@/api/git";
import {
  listGPGKeys,
  listSSHKeys,
  removeGPGKey,
  removeSSHKey,
} from "@/api/github";
import { deleteGPGKey } from "@/api/gpg";
import { removeSSHKeyFromKeychain } from "@/api/ssh";
import { Button } from "@/components/buttons/default";
import { Typography } from "@/components/typography";
import { getProfileById, type Profile, usePersistStore } from "@/store/persist";

import { GenericListNotificationBody } from "../../list";

interface Props {
  userId: Profile["user"]["id"];
  toastId: string;
  onClose?: () => void;
}

const ManageUserNotificationBody = ({ userId, toastId, onClose }: Props) => {
  const removeProfile = usePersistStore((state) => state.removeProfile);

  const [removingInProgress, setRemovingInProgress] = useState(false);

  const { T } = useT();

  const profile = useMemo(() => getProfileById(userId), [userId]);

  if (!profile) return null;

  return (
    <GenericListNotificationBody>
      <Button
        onClick={async () => {
          if (profile.type === "github")
            await open("https://github.com/settings");
        }}
        disabled={profile.type === "local"}
      >
        <Gear weight="fill" size={14} color="white" />
        <Typography bold>
          {T("notifications.manager.manage.to_settings")}
        </Typography>
      </Button>
      <Button
        loading={removingInProgress}
        onClick={async () => {
          setRemovingInProgress(true);

          if (profile.gpg) {
            await removeSigningKey();
            await setAutosign(false);

            if (profile.type === "github") {
              const keys = await listGPGKeys(profile.user.accessToken);
              const gpg = keys.find(({ key_id }) => key_id === profile.gpg);
              if (!gpg) throw new Error("No such GPG key");
              await removeGPGKey(profile.user.accessToken, gpg.id);
            }

            await deleteGPGKey(profile.user.email);
          }

          if (profile.ssh) {
            await removeSSHKeyFromKeychain();

            if (profile.type === "github") {
              const [algorithm, pub] = profile.ssh.public.split(" ");
              const keys = await listSSHKeys(profile.user.accessToken);
              const key = keys.find(({ key }) => key === `${algorithm} ${pub}`);
              if (!key) throw new Error("No such SSH key");
              await removeSSHKey(profile.user.accessToken, key.id);
            }
          }

          removeProfile(profile.user.id);
          toast.dismiss(toastId);
          if (onClose) onClose();

          setRemovingInProgress(false);
        }}
      >
        <Trash weight="fill" size={14} color="white" />
        <Typography bold>{T("notifications.manager.manage.remove")}</Typography>
      </Button>
    </GenericListNotificationBody>
  );
};

export const ManageUserNotification = (props: Props) => {
  return <ManageUserNotificationBody {...props} />;
};
