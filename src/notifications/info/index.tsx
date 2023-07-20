import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { ActionButton } from "../../components/buttons/action";
import { GenericActionNotificationContent } from "../action";
import {
  AutoClosableNotificationBody,
  AutoClosableNotificationProps,
} from "../autoclosable";

interface GenericInfoNotificationContentProps {
  title?: string;
  description: string;
  action?: () => void;
  actionText?: string;
}

const GenericInfoNotificationContent = ({
  toastId,
  title,
  description,
  action,
  actionText,
}: GenericInfoNotificationContentProps &
  Pick<AutoClosableNotificationProps, "toastId">) => {
  const { T } = useT();

  return (
    <GenericActionNotificationContent
      title={title || T("info.generic.title")}
      description={description}
    >
      <ActionButton
        onClick={() => {
          if (action) action();
          toast.dismiss(toastId);
        }}
      >
        {actionText || T("info.generic.action_text")}
      </ActionButton>
    </GenericActionNotificationContent>
  );
};

type Props = AutoClosableNotificationProps &
  GenericInfoNotificationContentProps;

export const GenericInfoNotification = ({
  title,
  description,
  action,
  actionText,
  ...props
}: Props) => {
  return (
    <AutoClosableNotificationBody
      {...props}
      duration={props.duration || 6 * 1000}
    >
      <GenericInfoNotificationContent
        toastId={props.toastId}
        title={title}
        description={description}
        action={action}
        actionText={actionText}
      />
    </AutoClosableNotificationBody>
  );
};
