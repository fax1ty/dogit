import { toast } from "react-hot-toast";

import { ActionButton } from "../../components/buttons/action";
import { Typography } from "../../components/typography";
import { AutoClosableNotificationBody } from "../autoclosable";
import classes from "./styles.module.scss";

const GenericErrorNotificationBody = ({
  id,
  title = "Ошибка",
  description = "Произошла ошибка. Это не очень хорошо. Но раз мы её обнаружили, то это и не очень плохо. Такое бывает ¯\\_(ツ)_/¯",
  actionText = "Закрыть",
  action,
}: Props) => {
  return (
    <div className={classes.content}>
      <div className={classes.text}>
        <Typography bold>{title}</Typography>
        <Typography>{description}</Typography>
      </div>
      <ActionButton
        onClick={() => {
          if (action) action();
          toast.dismiss(id);
        }}
      >
        {actionText}
      </ActionButton>
    </div>
  );
};

interface Props {
  duration?: number;
  id: string;
  title?: string;
  description?: string;
  actionText?: string;
  action?: () => void;
}

export const GenericErrorNotification = (props: Props) => {
  return (
    <AutoClosableNotificationBody
      id={props.id}
      duration={props.duration || 10 * 1000}
    >
      <GenericErrorNotificationBody {...props} />
    </AutoClosableNotificationBody>
  );
};
