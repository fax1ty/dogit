import { GitlabProfile } from "../../../store/persist";
import { BaseProfile, BaseProfileCardProps } from "./base";

export const GitlabProfileCard = ({
  onPrev,
  onNext,
  isFirst,
  user,
  gpg,
  ssh,
  sync,
  type,
}: BaseProfileCardProps & GitlabProfile) => {
  return (
    <BaseProfile
      onPrev={onPrev}
      onNext={onNext}
      isFirst={isFirst}
      avatar={user.avatar}
      name={user.name}
      email={user.email}
      gpg={Boolean(gpg)}
      ssh={Boolean(ssh)}
      remote
      sync={sync}
      id={user.id}
      type={type}
    />
  );
};
