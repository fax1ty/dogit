import {
  appWindow,
  // currentMonitor,
  LogicalPosition,
  // LogicalSize,
} from "@tauri-apps/api/window";
import { useEffect, useRef } from "react";
// import { useToasterStore } from "react-hot-toast";

export const Resizer = () => {
  // TODO: Not yet ready
  // const { toasts } = useToasterStore();

  // useEffect(() => {
  //   (async () => {
  //     const [root] = document.getElementsByClassName("toasts");
  //     if (!root) return;
  //     const { height } = window.getComputedStyle(root, null);
  //     const heightInt = parseFloat(height.replace("px", ""));
  //     const factor = await appWindow.scaleFactor();
  //     const { y: prevHeight } = (await appWindow.outerPosition()).toLogical(
  //       factor
  //     );
  //     const position = (await appWindow.outerPosition()).toLogical(factor);
  //     await appWindow.setSize(new LogicalSize(480, heightInt));
  //     const montor = await currentMonitor();
  //     if (!montor) return;
  //     console.log(position.x, montor.size.height - heightInt);
  //     await appWindow.setPosition(
  //       new LogicalPosition(position.x, position.y + (prevHeight - heightInt))
  //     );
  //   })();
  // }, [toasts]);

  const isResizeDone = useRef(false);

  useEffect(() => {
    (async () => {
      if (isResizeDone.current) return;
      const factor = await appWindow.scaleFactor();
      const position = (await appWindow.outerPosition()).toLogical(factor);
      await appWindow.setPosition(
        new LogicalPosition(position.x - 20, position.y - 70)
      );
      isResizeDone.current = true;
    })();
  }, []);

  return null;
};
