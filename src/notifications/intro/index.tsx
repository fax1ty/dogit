import { open } from "@tauri-apps/plugin-shell";
import { logEvent } from "firebase/analytics";
import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "talkr";

import { analytics } from "@/analytics";
import { isGitAvailable } from "@/api/git";
import { ActionButton } from "@/components/buttons/action";

import { GenericActionNotificationContent } from "../action";
import { BaseNotificationBody } from "../base";
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
                toastId={t.id}
                title={T("errors.git_not_available.title")}
                description={T("errors.git_not_available.description")}
                actionText={T("errors.git_not_available.action_text")}
                action={async () => {
                  await open("https://git-scm.com/");
                }}
              />
            ));
          else {
            toast(<ImportNotification />, { id: "import" });
            setImportOpen(true);
            logEvent(analytics, "intro_passed");
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
    <BaseNotificationBody>
      <GenericActionNotificationContent
        title={T("notifications.intro.title")}
        description={T("notifications.intro.description")}
      >
        <IntroActionButton />
      </GenericActionNotificationContent>
    </BaseNotificationBody>
  );
};
