import { Clipboard, Trash } from "@phosphor-icons/react";
import { clipboard } from "@tauri-apps/api";
import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { Button } from "../../components/buttons/default";
import { Typography } from "../../components/typography";
import { getProfileById, Profile } from "../../store/persist";
import { GenericListNotificationBody } from "../list";
import { SSHCopiedNotification } from "./copied";
import { RemoveSSHNotification } from "./remove";

interface Props {
  toastId: string;
  userId: Profile["user"]["id"];
  onClose?: () => void;
}

export const ManageSSHNotification = ({ userId, toastId, onClose }: Props) => {
  const { T } = useT();

  return (
    <GenericListNotificationBody>
      <Button
        onClick={async () => {
          const profile = getProfileById(userId);
          if (!profile || !profile.ssh) return;
          await clipboard.writeText(profile.ssh.public);
          toast((t) => <SSHCopiedNotification toastId={t.id} />);
          toast.dismiss(toastId);
          if (onClose) onClose();
        }}
      >
        <Clipboard weight="fill" size={14} color="white" />
        <Typography bold>{T("notifications.ssh.manage.copy")}</Typography>
      </Button>
      <Button
        onClick={async () => {
          toast.dismiss(toastId);
          if (onClose) onClose();
          toast(
            (t) => <RemoveSSHNotification toastId={t.id} userId={userId} />,
            {
              id: "remove-ssh",
            }
          );
        }}
      >
        <Trash weight="fill" size={14} color="white" />
        <Typography bold>{T("notifications.ssh.manage.remove")}</Typography>
      </Button>
    </GenericListNotificationBody>
  );
};
