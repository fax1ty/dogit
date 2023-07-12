import { useMemo } from "react";

import { useGithubProfile } from "../../../api/github";
import { GithubProfile, usePersistStore } from "../../../store/persist";
import { BaseProfile, BaseProfileCardProps } from "./base";

export const GithubProfileCard = ({
  onPrev,
  onNext,
  isFirst,
  user,
  gpg,
  ssh,
  sync,
  type,
}: BaseProfileCardProps & GithubProfile) => {
  const { data: profile, error } = useGithubProfile(user.id, user.accessToken);
  const localProfile = useMemo(
    () =>
      usePersistStore
        .getState()
        .profiles.find(
          ({ user: { id }, type }) => id === user.id && type === "github"
        ) as GithubProfile | undefined,
    [user.id]
  );

  if (!localProfile) return null;

  return (
    <BaseProfile
      onPrev={onPrev}
      onNext={onNext}
      isFirst={isFirst}
      avatar={profile?.avatar_url || localProfile.user.avatar}
      name={profile?.name || localProfile.user.name}
      email={profile?.email || localProfile.user.email}
      gpg={Boolean(gpg)}
      ssh={Boolean(ssh)}
      remote
      sync={error ? "error" : sync}
      id={user.id}
      type={type}
    />
  );
};
