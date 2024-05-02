import { type ReactElement } from "react";

import { type ButtonProps } from "@/components/buttons/default";

// import { useVirtualScroll } from "../../hooks/scrollbar";
import { BaseNotificationBody } from "../base";
import classes from "./styles.module.scss";

interface Props {
  children: ReactElement<ButtonProps> | Array<ReactElement<ButtonProps>>;
}

export const GenericListNotificationBody = ({ children }: Props) => {
  // const [scrollable, handle, bar] = useVirtualScroll();

  return (
    <BaseNotificationBody>
      {/* <div className={classes.fake} />
      <div className={classes.scrollbar} ref={bar}>
        <div className={classes.handle} ref={handle} />
      </div> */}

      {/* <div ref={scrollable} className={classes.container}> */}

      <div className={classes.content}>{children}</div>

      {/* </div> */}
    </BaseNotificationBody>
  );
};
