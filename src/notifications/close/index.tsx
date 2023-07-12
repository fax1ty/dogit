import { appWindow } from "@tauri-apps/api/window";
import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { Typography } from "../../components/typography";
import { useAppStore } from "../../store/app";
import { BaseNotificationBody } from "../base";
import classes from "./styles.module.scss";

const CloseNotificationBody = () => {
  const { T } = useT();

  return (
    <div className={classes.content}>
      <Typography bold>{T("notifications.close.text")}</Typography>
    </div>
  );
};

export const CloseNotification = () => {
  const setNotificationsCreated = useAppStore(
    (state) => state.setNotificationsCreated
  );
  return (
    <BaseNotificationBody
      className={classes.body}
      onClick={async () => {
        toast.dismiss();
        setTimeout(async () => {
          await appWindow.hide();
          setNotificationsCreated(false);
        }, 350);
      }}
    >
      <CloseNotificationBody />
    </BaseNotificationBody>
  );
};
