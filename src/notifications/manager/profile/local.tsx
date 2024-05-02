import { useMemo } from "react";

import { useLocalProfile } from "@/api/git";
import { type LocalProfile, usePersistStore } from "@/store/persist";

import { BaseProfile, type BaseProfileCardProps } from "./base";

export const LocalProfileCard = ({
  onPrev,
  onNext,
  isFirst,
  user,
  gpg,
  ssh,
  sync,
  type,
}: BaseProfileCardProps & LocalProfile) => {
  const { data: profile, error } = useLocalProfile();
  const localProfile = useMemo(
    () =>
      usePersistStore
        .getState()
        .profiles.find(({ type }) => type === "local") as
        | LocalProfile
        | undefined,
    []
  );

  if (!localProfile) return null;

  return (
    <BaseProfile
      onPrev={onPrev}
      onNext={onNext}
      isFirst={isFirst}
      name={profile?.user.name ?? localProfile.user.name}
      email={profile?.user.email ?? localProfile.user.email}
      gpg={Boolean(gpg)}
      ssh={Boolean(ssh)}
      remote={false}
      sync={error ? "error" : sync}
      id={user.id}
      type={type}
    />
  );
};
