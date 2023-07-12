import { ArrowRight } from "@phosphor-icons/react";
import clsx from "clsx";
import { HTMLAttributes } from "react";
import { SpinnerCircular } from "spinners-react";

import { Typography } from "../../typography";
import classes from "./styles.module.scss";

export type ActionButtonProps = {
  reverse?: boolean;
  loading?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const ActionButton = ({
  children,
  reverse = false,
  loading = false,
  ...props
}: ActionButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(props.className, classes.button)}
      disabled={loading}
    >
      <Typography bold>{children}</Typography>
      {loading ? (
        <SpinnerCircular
          style={{ marginLeft: 8 }}
          size={18}
          color="white"
          secondaryColor="rgba(255, 255, 255, 0.7)"
          thickness={300}
        />
      ) : (
        <ArrowRight
          className={clsx(classes.arrow, reverse && classes.reverse)}
          size={18}
          weight="bold"
        />
      )}
    </button>
  );
};
