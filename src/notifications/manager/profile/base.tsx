import {
  Cloud,
  CloudArrowDown,
  CloudCheck,
  CloudSlash,
  House,
  Key,
  Lock,
  LockOpen,
  Shield,
  User,
} from "@phosphor-icons/react";
import { open } from "@tauri-apps/api/shell";
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import AutosizeInput from "react-input-autosize";
import { mutate } from "swr";
import { useT } from "talkr";

import { isGPGAvailable } from "../../../api/gpg";
import { isSSHAvailable } from "../../../api/ssh";
import { Chip } from "../../../components/chip";
import { Bubble } from "../../../components/floating/bubble";
import { Typography } from "../../../components/typography";
import { useAppStore } from "../../../store/app";
import { Profile, usePersistStore } from "../../../store/persist";
import { GenericErrorNotification } from "../../error";
import { AddGPGNotification } from "../../gpg/add";
import { RemoveGPGNotification } from "../../gpg/remove";
import { AddSSHNotification } from "../../ssh/add";
import { RemoveSSHNotification } from "../../ssh/remove";
import { BaseCard, BaseCardProps } from "../card";
import { ManageUserNotification } from "../manage";
import classes from "./styles.module.scss";

export type BaseProfileCardProps = Omit<BaseCardProps, "isLast">;

type Props = BaseProfileCardProps & {
  avatar?: string;
  gpg: boolean;
  ssh: boolean;
  remote: boolean;
  name: string;
  email: string;
  sync: Profile["sync"] | "error";
  id: Profile["user"]["id"];
  type: Profile["type"];
};

export const BaseProfile = ({
  onPrev,
  onNext,
  isFirst,
  avatar,
  gpg,
  ssh,
  remote,
  name,
  email,
  sync,
  id,
  type,
}: Props) => {
  const [isGPGOpen, setGPGOpen] = useState(false);
  const [isSSHOpen, setSSHOpen] = useState(false);
  const [isManageOpen, setManageOpen] = useState(false);

  const isEditable = useAppStore((state) => state.isEditable);
  const setEditable = useAppStore((state) => state.setEditable);

  const updateProfileUser = usePersistStore((state) => state.updateProfileUser);

  const hideGPGNotifications = () => {
    toast.dismiss("add-gpg");
    toast.dismiss("remove-gpg");
    setGPGOpen(false);
  };
  const hideSSHNotifications = () => {
    toast.dismiss("add-ssh");
    toast.dismiss("remove-ssh");
    setSSHOpen(false);
  };
  const hideManageNotification = () => {
    toast.dismiss("manage-user");
    setManageOpen(false);
  };

  const onPrevHooked = () => {
    hideGPGNotifications();
    hideSSHNotifications();
    hideManageNotification();
    if (onPrev) onPrev();
  };
  const onNextHooked = () => {
    hideGPGNotifications();
    hideSSHNotifications();
    hideManageNotification();
    if (onNext) onNext();
  };

  const { T } = useT();

  const manage = () => {
    if (isManageOpen) hideManageNotification();
    else {
      toast(
        (t) => (
          <ManageUserNotification
            toastId={t.id}
            id={id}
            email={email}
            gpg={gpg}
            ssh={ssh}
            type={type}
            onClose={() => setManageOpen(false)}
          />
        ),
        {
          id: "manage-user",
        }
      );
      setManageOpen(true);
    }
  };

  return (
    <BaseCard
      onPrev={onPrevHooked}
      onNext={onNextHooked}
      isFirst={isFirst}
      isLast={false}
    >
      <div className={classes.profile}>
        {avatar ? (
          <img
            alt={T("notifications.manager.profile.avatar_alt")}
            src={avatar}
            className={classes.avatar}
            onClick={manage}
          />
        ) : (
          <div className={clsx(classes.avatar, classes.fake)} onClick={manage}>
            <User weight="fill" color="white" size={24} />
          </div>
        )}
        <div className={classes.data}>
          <div className={classes.chips}>
            <Chip
              active={isGPGOpen}
              outlined={gpg}
              button
              onClick={async () => {
                if (isGPGOpen) return hideGPGNotifications();

                if (gpg) {
                  toast(
                    (t) => (
                      <RemoveGPGNotification
                        id={id}
                        toastId={t.id}
                        onClose={() => setGPGOpen(false)}
                      />
                    ),
                    { id: "remove-gpg" }
                  );
                  setGPGOpen(true);
                } else {
                  const canDoGPG = await isGPGAvailable();
                  if (!canDoGPG)
                    toast((t) => (
                      <GenericErrorNotification
                        id={t.id}
                        title={T("errors.gpg_not_available.title")}
                        description={T("errors.gpg_not_available.description")}
                        actionText={T("errors.gpg_not_available.action_text")}
                        action={async () =>
                          await open("https://gpg4win.org/download.html")
                        }
                      />
                    ));
                  else {
                    toast(
                      (t) => (
                        <AddGPGNotification
                          id={id}
                          toastId={t.id}
                          onClose={() => setGPGOpen(false)}
                        />
                      ),
                      {
                        id: "add-gpg",
                      }
                    );
                    setGPGOpen(true);
                  }
                }
              }}
            >
              <Key weight="fill" />
              <Typography bold>GPG</Typography>
            </Chip>
            <Chip
              active={isSSHOpen}
              outlined={ssh}
              button
              onClick={async () => {
                if (isSSHOpen) return hideSSHNotifications();

                if (ssh) {
                  toast(
                    (t) => (
                      <RemoveSSHNotification
                        id={id}
                        toastId={t.id}
                        onClose={() => setSSHOpen(false)}
                      />
                    ),
                    { id: "remove-ssh" }
                  );
                  setSSHOpen(true);
                } else {
                  const canDoSSH = await isSSHAvailable();
                  if (!canDoSSH)
                    toast((t) => (
                      <GenericErrorNotification
                        id={t.id}
                        title={T("errors.ssh_not_available.title")}
                        description={T("errors.ssh_not_available.description")}
                        actionText={T("errors.ssh_not_available.action_text")}
                        action={async () =>
                          await open(
                            "https://slproweb.com/products/Win32OpenSSL.html"
                          )
                        }
                      />
                    ));
                  else {
                    toast(
                      (t) => (
                        <AddSSHNotification
                          id={id}
                          toastId={t.id}
                          onClose={() => setSSHOpen(false)}
                        />
                      ),
                      {
                        id: "add-ssh",
                      }
                    );
                    setSSHOpen(true);
                  }
                }
              }}
            >
              <Shield weight="fill" />
              <Typography bold>SSH</Typography>
            </Chip>
            <Chip>
              {remote ? <Cloud weight="fill" /> : <House weight="fill" />}
              <Typography bold>
                {remote
                  ? T("notifications.manager.profile.remoteness.remote")
                  : T("notifications.manager.profile.remoteness.local")}
              </Typography>
            </Chip>
          </div>
          <div className={classes.info}>
            <div className={classes.name}>
              <AutosizeInput
                placeholder={T(
                  "notifications.manager.profile.placeholders.name"
                )}
                className={classes.textContainer}
                inputClassName={clsx(classes.input, classes.text)}
                value={name}
                disabled={!isEditable}
                onChange={async ({ target }) => {
                  updateProfileUser(id, (v) => {
                    const copy = { ...v };
                    copy.name = target.value;
                    return copy;
                  });
                }}
                onBlur={async () => await mutate("/local-profile")}
              />
              <Bubble
                onClick={() => {
                  if (type === "local") {
                    if (isEditable) setEditable(false);
                    else setEditable(true);
                  }
                }}
                of={
                  type === "local" ? (
                    isEditable ? (
                      <LockOpen weight="fill" className={classes.icon} />
                    ) : (
                      <Lock weight="fill" className={classes.icon} />
                    )
                  ) : sync === "error" ? (
                    <CloudSlash weight="fill" className={classes.icon} />
                  ) : sync.inProgress ? (
                    <CloudArrowDown weight="fill" className={classes.icon} />
                  ) : (
                    <CloudCheck weight="fill" className={classes.icon} />
                  )
                }
              >
                <Typography className={classes.tooltip}>
                  {type === "local"
                    ? isEditable
                      ? T("notifications.manager.profile.lock.unlocked")
                      : T("notifications.manager.profile.lock.locked")
                    : sync === "error"
                    ? T("notifications.manager.profile.sync_status.error")
                    : sync.inProgress
                    ? T("notifications.manager.profile.sync_status.in_progress")
                    : T("notifications.manager.profile.sync_status.default")}
                </Typography>
              </Bubble>
            </div>
            <AutosizeInput
              placeholder={T(
                "notifications.manager.profile.placeholders.email"
              )}
              className={classes.emailContainer}
              inputClassName={clsx(classes.input, classes.email)}
              value={email}
              disabled={!isEditable}
              onChange={async ({ target }) => {
                updateProfileUser(id, (v) => {
                  const copy = { ...v };
                  copy.email = target.value;
                  return copy;
                });
              }}
              onBlur={async () => await mutate("/local-profile")}
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
