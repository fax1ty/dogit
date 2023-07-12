import { open } from "@tauri-apps/api/shell";
import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { isGitAvailable } from "../../api/git";
import { ActionButton } from "../../components/buttons/action";
import { GenericActionNotificationBody } from "../action";
import { GenericErrorNotification } from "../error";
import { ImportNotification } from "../import";

const IntroActionButton = () => {
  const [isImportOpen, setImportOpen] = useState(false);

  const { T } = useT();

  return (
    <ActionButton
      reverse={isImportOpen}
      onClick={async () => {
        if (isImportOpen) {
          toast.dismiss("import");
          setImportOpen(false);
        } else {
          const canDoGit = await isGitAvailable();
          if (!canDoGit)
            toast((t) => (
              <GenericErrorNotification
                id={t.id}
                title={T("errors.git_not_available.title")}
                description={T("errors.git_not_available.description")}
                actionText={T("errors.git_not_available.action_text")}
                action={async () => await open("https://git-scm.com/")}
              />
            ));
          else {
            toast(<ImportNotification />, { id: "import" });
            setImportOpen(true);
          }
        }
      }}
    >
      {isImportOpen
        ? T("notifications.intro.button.active")
        : T("notifications.intro.button.default")}
    </ActionButton>
  );
};

export const IntroNotification = () => {
  const { T } = useT();

  return (
    <GenericActionNotificationBody
      title={T("notifications.intro.title")}
      description={T("notifications.intro.description")}
    >
      <IntroActionButton />
    </GenericActionNotificationBody>
  );
};
