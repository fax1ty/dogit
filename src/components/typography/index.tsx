import clsx from "clsx";
import { type HTMLAttributes } from "react";

import classes from "./styles.module.scss";

type Props = {
  bold?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

export const Typography = ({ children, bold, ...props }: Props) => {
  return (
    <p
      {...props}
      className={clsx(props.className, bold ? classes.bold : classes.regular)}
    >
      {children}
    </p>
  );
};
