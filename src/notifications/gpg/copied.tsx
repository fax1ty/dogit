import { useT } from "talkr";

import { AutoClosableNotificationProps } from "../autoclosable";
import { GenericInfoNotification } from "../info";

export const GPGCopiedNotification = (props: AutoClosableNotificationProps) => {
  const { T } = useT();

  return (
    <GenericInfoNotification
      {...props}
      title={T("info.gpg_copied.title")}
      description={T("info.gpg_copied.description")}
      duration={1000 * 3}
    />
  );
};
