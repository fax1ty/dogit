import { Gear, Trash } from "@phosphor-icons/react";
import { open } from "@tauri-apps/api/shell";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { removeSigningKey, setAutosign } from "../../../api/git";
import { deleteGPGKey } from "../../../api/gpg";
import { removeSSHKeyFromKeychain } from "../../../api/ssh";
import { Button } from "../../../components/buttons/default";
import { Typography } from "../../../components/typography";
// import { useVirtualScroll } from "../../../hooks/scrollbar";
import { Profile, usePersistStore } from "../../../store/persist";
import { BaseNotificationBody } from "../../base";
import classes from "./styles.module.scss";

interface Props {
  email: Profile["user"]["email"];
  type: Profile["type"];
  gpg: boolean;
  ssh: boolean;
  id: Profile["user"]["id"];
  toastId: string;
  onClose?: () => void;
}

const ManageUserNotificationBody = ({
  email,
  type,
  gpg,
  ssh,
  id,
  toastId,
  onClose,
}: Props) => {
  // const [scrollable, handle, bar] = useVirtualScroll();

  const removeProfile = usePersistStore((state) => state.removeProfile);

  const [removingInProgress, setRemovingInProgress] = useState(false);

  const { T } = useT();

  return (
    <div className={classes.content}>
      {/* <div className={classes.fake} />
      <div className={classes.scrollbar} ref={bar}>
        <div className={classes.handle} ref={handle} />
      </div> */}

      {/* <div ref={scrollable} className={classes.container}> */}
      <Button
        onClick={async () => {
          if (type === "github") await open("https://github.com/settings");
        }}
        disabled={type === "local"}
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

          if (gpg) {
            await removeSigningKey();
            await setAutosign(false);

            if (type === "github") {
              //! 404
              //   const keys = await listGPGKeys(profile.user.accessToken);
              //   const gpg = keys.find(({ key_id }) => key_id === profile.gpg);
              //   if (!gpg) throw new Error("No such GPG key");
              //   await removeGPGKey(profile.user.accessToken, gpg.id);
            }

            await deleteGPGKey(email);
          }

          if (ssh) {
            await removeSSHKeyFromKeychain();

            if (type === "github") {
              //!404
              //   const [algorithm, pub] = profile.ssh.split(" ");
              //   const keys = await listSSHKeys(profile.user.accessToken);
              //   const key = keys.find(({ key }) => key === `${algorithm} ${pub}`);
              //   if (!key) throw new Error("No such SSH key");
              //   await removeSSHKey(profile.user.accessToken, key.id);
            }
          }

          removeProfile(id);
          toast.dismiss(toastId);
          if (onClose) onClose();

          setRemovingInProgress(false);
        }}
      >
        <Trash weight="fill" size={14} color="white" />
        <Typography bold>{T("notifications.manager.manage.remove")}</Typography>
      </Button>
    </div>
    // </div>
  );
};

export const ManageUserNotification = (props: Props) => {
  return (
    <BaseNotificationBody>
      <ManageUserNotificationBody {...props} />
    </BaseNotificationBody>
  );
};
