import {
  offset,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import { HTMLAttributes, ReactNode, useState } from "react";

import classes from "./styles.module.scss";

type Props = { of: ReactNode } & HTMLAttributes<HTMLDivElement>;

export const Bubble = ({ of, children, ...props }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right",
    middleware: [offset({ mainAxis: 8 })],
  });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  const { isMounted, styles } = useTransitionStyles(context);

  return (
    <>
      <div {...props} ref={refs.setReference} {...getReferenceProps()}>
        {of}
      </div>
      {isMounted && (
        <div
          className={classes.floating}
          ref={refs.setFloating}
          style={{ ...floatingStyles, ...styles }}
          {...getFloatingProps()}
        >
          {children}
        </div>
      )}
    </>
  );
};
