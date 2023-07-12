import clsx from "clsx";
import { HTMLAttributes } from "react";

import classes from "./styles.module.scss";

type Props = {
  active?: boolean;
  outlined?: boolean;
  button?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Chip = ({
  button,
  outlined = false,
  active = false,
  children,
  ...props
}: Props) => {
  return (
    <div
      {...props}
      className={clsx(
        props.className,
        classes.chip,
        outlined && classes.outlined,
        button && classes.button,
        active && classes.active
      )}
    >
      {children}
    </div>
  );
};
