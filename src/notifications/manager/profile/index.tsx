import { Profile } from "../../../store/persist";
import { BaseProfileCardProps } from "./base";
import { GithubProfileCard } from "./github";
import { GitlabProfileCard } from "./gitlab";
import { LocalProfileCard } from "./local";

export const ProfileCard = (props: Profile & BaseProfileCardProps) => {
  if (props.type === "github") return <GithubProfileCard {...props} />;
  if (props.type === "gitlab") return <GitlabProfileCard {...props} />;
  if (props.type === "local") return <LocalProfileCard {...props} />;
  return null;
};
