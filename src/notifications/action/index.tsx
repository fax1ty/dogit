import { ReactElement } from "react";

import { ActionButtonProps } from "../../components/buttons/action";
import { Typography } from "../../components/typography";
import { BaseNotificationBody } from "../base";
import classes from "./styles.module.scss";

interface Props {
  title: string;
  description: string;
  children: ReactElement<ActionButtonProps> | ReactElement<ActionButtonProps>[];
}

export const GenericActionNotificationBody = ({
  children,
  title,
  description,
}: Props) => {
  return (
    <BaseNotificationBody>
      <div className={classes.content}>
        <div className={classes.text}>
          <Typography bold>{title}</Typography>
          <Typography>{description}</Typography>
        </div>
        <div className={classes.buttons}>{children}</div>
      </div>
    </BaseNotificationBody>
  );
};
