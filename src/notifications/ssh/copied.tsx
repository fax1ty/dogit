import { useT } from "talkr";

import { AutoClosableNotificationProps } from "../autoclosable";
import { GenericInfoNotification } from "../info";

export const SSHCopiedNotification = (props: AutoClosableNotificationProps) => {
  const { T } = useT();

  return (
    <GenericInfoNotification
      {...props}
      title={T("info.ssh_copied.title")}
      description={T("info.ssh_copied.description")}
      duration={1000 * 3}
    />
  );
};
