import { open } from "@tauri-apps/api/shell";
import { useT } from "talkr";

import { ActionButton } from "../../components/buttons/action";
import { Typography } from "../../components/typography";
import { usePersistStore } from "../../store/persist";
import { AutoClosableNotificationBody } from "../autoclosable";
import classes from "./styles.module.scss";

const UpdateNotificationBody = () => {
  const lastVersion = usePersistStore((state) => state.lastVersion);

  const { T } = useT();

  return (
    <div className={classes.content}>
      <div className={classes.text}>
        <Typography bold>{T("notifications.update.title")}</Typography>
        <Typography>
          {T("notifications.update.description", { version: lastVersion })}
        </Typography>
      </div>
      <ActionButton
        onClick={async () => {
          if (lastVersion)
            await open(
              `https://github.com/fax1ty/dogit/releases/tag/v${lastVersion}`
            );
        }}
      >
        {T("notifications.update.button")}
      </ActionButton>
    </div>
  );
};

interface Props {
  toastId: string;
}

export const UpdateNotification = ({ toastId }: Props) => {
  return (
    <AutoClosableNotificationBody id={toastId}>
      <UpdateNotificationBody />
    </AutoClosableNotificationBody>
  );
};
