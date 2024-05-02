import { ArrowRight, type Icon } from "@phosphor-icons/react";
import clsx from "clsx";
import { type ButtonHTMLAttributes, createElement } from "react";
import { SpinnerCircular } from "spinners-react";

import { Typography } from "@/components/typography";

import classes from "./styles.module.scss";

export type ActionButtonProps = {
  icon?: Icon;
  reverse?: boolean;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ActionButton = ({
  icon = ArrowRight,
  children,
  reverse = false,
  loading = false,
  ...props
}: ActionButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(props.className, classes.button)}
      disabled={props.disabled ?? loading}
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
        createElement(icon, {
          className: clsx(classes.arrow, reverse && classes.reverse),
          size: 18,
          weight: "bold",
        })
      )}
    </button>
  );
};
