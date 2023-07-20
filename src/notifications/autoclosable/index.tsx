import clsx from "clsx";
import { HTMLAttributes, ReactElement } from "react";
import { toast } from "react-hot-toast";

import { useVisualProgress } from "../../hooks/progress";
import { BaseNotificationBody } from "../base";
import classes from "./styles.module.scss";

export interface AutoClosableNotificationProps {
  duration?: number;
  toastId: string;
}

type Props = {
  children: ReactElement;
} & AutoClosableNotificationProps &
  HTMLAttributes<HTMLDivElement>;

export const AutoClosableNotificationBody = ({
  duration = 5 * 1000,
  children,
  toastId,
  ...props
}: Props) => {
  const [progress, indicator] = useVisualProgress(duration, () => {
    toast.dismiss(toastId);
  });

  return (
    <BaseNotificationBody
      {...props}
      className={clsx(props.className, classes.notification)}
    >
      {children}

      <div className={classes.progress} ref={progress}>
        <div className={classes.indicator} ref={indicator} />
      </div>
    </BaseNotificationBody>
  );
};
