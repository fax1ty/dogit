import { type ReactElement } from "react";

import { type ActionButtonProps } from "@/components/buttons/action";
import { Typography } from "@/components/typography";

import classes from "./styles.module.scss";

interface Props {
  title: string;
  description: string;
  children:
    | ReactElement<ActionButtonProps>
    | Array<ReactElement<ActionButtonProps>>;
}

export const GenericActionNotificationContent = ({
  children,
  title,
  description,
}: Props) => {
  return (
    <div className={classes.content}>
      <div className={classes.text}>
        <Typography bold>{title}</Typography>
        <Typography>{description}</Typography>
      </div>
      <div className={classes.buttons}>{children}</div>
    </div>
  );
};
