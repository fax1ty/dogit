import { Plus } from "@phosphor-icons/react";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useT } from "talkr";

import { Typography } from "../../../components/typography";
import { useAppStore } from "../../../store/app";
import { ImportNotification } from "../../import";
import { BaseCard, BaseCardProps } from "../card";
import classes from "./styles.module.scss";

type Props = Omit<BaseCardProps, "onNext">;

export const AddCard = (props: Props) => {
  const [importInProgress, setImportInProgress] = useState(false);

  const setGithubImportInProgress = useAppStore(
    (state) => state.setGithubImportInProgress
  );
  const setGitlabImportInProgress = useAppStore(
    (state) => state.setGitlabImportInProgress
  );

  const cancel = () => {
    toast.dismiss("import");
    setImportInProgress(false);
    setGithubImportInProgress(false);
    setGitlabImportInProgress(false);
  };

  const { T } = useT();

  return (
    <BaseCard
      {...props}
      onPrev={() => {
        if (props.onPrev) props.onPrev();
        cancel();
      }}
    >
      <div className={classes.add}>
        <button
          className={classes.content}
          onClick={() => {
            if (importInProgress) {
              toast.dismiss("import");
              cancel();
            } else {
              toast(
                (t) => (
                  <ImportNotification
                    onClose={() => {
                      setImportInProgress(false);
                      toast.dismiss(t.id);
                    }}
                  />
                ),
                { id: "import" }
              );
              setImportInProgress(true);
            }
          }}
        >
          <Typography bold>
            {importInProgress
              ? T("notifications.manager.add.text.active")
              : T("notifications.manager.add.text.default")}
          </Typography>
          <Plus
            weight="bold"
            className={clsx(importInProgress && classes.cancel)}
          />
        </button>
      </div>
    </BaseCard>
  );
};
