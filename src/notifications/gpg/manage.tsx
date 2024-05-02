import { Clipboard, Trash } from "@phosphor-icons/react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { exportArmoredPubKey } from "@/api/gpg";
import { Button } from "@/components/buttons/default";
import { Typography } from "@/components/typography";
import { type Profile } from "@/store/persist";

import { GenericListNotificationBody } from "../list";
import { GPGCopiedNotification } from "./copied";
import { RemoveGPGNotification } from "./remove";

interface Props {
  toastId: string;
  email: Profile["user"]["email"];
  id: Profile["user"]["id"];
  onClose?: () => void;
}

export const ManageGPGNotification = ({
  id,
  email,
  toastId,
  onClose,
}: Props) => {
  const { T } = useT();

  return (
    <GenericListNotificationBody>
      <Button
        onClick={async () => {
          const gpg = await exportArmoredPubKey(email);
          await writeText(gpg);
          toast((t) => <GPGCopiedNotification toastId={t.id} />);
          toast.dismiss(toastId);
          if (onClose) onClose();
        }}
      >
        <Clipboard weight="fill" size={14} color="white" />
        <Typography bold>{T("notifications.gpg.manage.copy")}</Typography>
      </Button>
      <Button
        onClick={async () => {
          toast.dismiss(toastId);
          if (onClose) onClose();
          toast((t) => <RemoveGPGNotification toastId={t.id} userId={id} />, {
            id: "remove-gpg",
          });
        }}
      >
        <Trash weight="fill" size={14} color="white" />
        <Typography bold>{T("notifications.gpg.manage.remove")}</Typography>
      </Button>
    </GenericListNotificationBody>
  );
};
