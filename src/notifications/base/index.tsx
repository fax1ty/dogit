import clsx from "clsx";
import { type HTMLAttributes, type ReactNode } from "react";

import classes from "./styles.module.scss";

type Props = {
  children: ReactNode;
  contentClassName?: string;
} & HTMLAttributes<HTMLDivElement>;

export const BaseNotificationBody = ({
  children,
  contentClassName,
  ...props
}: Props) => {
  return (
    <div {...props} className={clsx(props.className, classes.notification)}>
      <div className={clsx(contentClassName, classes.content)}>{children}</div>
    </div>
  );
};
