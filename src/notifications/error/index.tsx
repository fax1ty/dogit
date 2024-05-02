import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { ActionButton } from "@/components/buttons/action";

import { GenericActionNotificationContent } from "../action";
import {
  AutoClosableNotificationBody,
  type AutoClosableNotificationProps,
} from "../autoclosable";

interface GenericErrorNotificationContentProps {
  title?: string;
  description?: string;
  action?: () => void;
  actionText?: string;
}

const GenericErrorNotificationContent = ({
  toastId,
  title,
  description,
  actionText,
  action,
}: GenericErrorNotificationContentProps &
  Pick<AutoClosableNotificationProps, "toastId">) => {
  const { T } = useT();

  return (
    <GenericActionNotificationContent
      title={title || T("errors.generic.title")}
      description={description || T("errors.generic.description")}
    >
      <ActionButton
        onClick={() => {
          if (action) action();
          toast.dismiss(toastId);
        }}
      >
        {actionText || T("errors.generic.action_text")}
      </ActionButton>
    </GenericActionNotificationContent>
  );
};

type Props = AutoClosableNotificationProps &
  GenericErrorNotificationContentProps;

export const GenericErrorNotification = ({
  title,
  description,
  action,
  actionText,
  ...props
}: Props) => {
  return (
    <AutoClosableNotificationBody
      {...props}
      duration={props.duration || 10 * 1000}
    >
      <GenericErrorNotificationContent
        toastId={props.toastId}
        title={title}
        description={description}
        action={action}
        actionText={actionText}
      />
    </AutoClosableNotificationBody>
  );
};
