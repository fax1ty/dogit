import clsx from "clsx";
import { type ButtonHTMLAttributes } from "react";
import { SpinnerCircular } from "spinners-react";

import classes from "./styles.module.scss";

export type ButtonProps = {
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  loading = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button {...props} className={clsx(props.className, classes.button)}>
      {children}

      <div className={clsx(classes.loading, loading && classes.visible)}>
        <SpinnerCircular
          size={18}
          color="white"
          secondaryColor="rgba(255, 255, 255, 0.7)"
          thickness={300}
        />
      </div>
    </button>
  );
};
