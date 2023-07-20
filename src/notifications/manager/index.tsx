import clsx from "clsx";
import { useKeenSlider } from "keen-slider/react.es";
import { useCallback, useEffect, useMemo } from "react";
import { mutate } from "swr";

import { Blobs } from "../../components/blobs";
import { Profile, usePersistStore } from "../../store/persist";
import { BaseNotificationBody } from "../base";
import { AddCard } from "./add";
import { ProfileCard } from "./profile";
import classes from "./styles.module.scss";

const Background = () => {
  const selectedId = usePersistStore((state) => state.selectedId);
  const colors = useMemo<Profile["colors"]>(
    () =>
      usePersistStore
        .getState()
        .profiles.find(({ user: { id } }) => selectedId === id)?.colors || [
        "#000AFF",
        "#DB00FF",
        "#00A3FF",
      ],
    [selectedId]
  );

  return (
    <>
      <Blobs className={classes.background} colors={colors} />
      <div className={classes.glass} />
    </>
  );
};

const Slides = () => {
  const selectProfile = usePersistStore((state) => state.selectProfile);

  const onPrev = useCallback(() => api.current?.prev(), []);
  const onNext = useCallback(() => api.current?.next(), []);
  const onInit = (initial: number) =>
    api.current?.moveToIdx(initial, false, { duration: 0 });

  const profiles = usePersistStore((state) => state.profiles);

  const [ref, api] = useKeenSlider({
    // Пока не придумаю лучшее решение для колбека на изменение слайда.
    // Иначе не работает логика закрытия доп. уведомлений
    drag: false,
    initial: 0,
    animationEnded: async (api) => {
      const idx = api.track.details.rel;
      const profiles = usePersistStore.getState().profiles;
      if (idx > profiles.length - 1) return;
      selectProfile(idx);

      const profile = profiles[idx];
      if (profile.type === "github")
        await mutate(`/github-profile/${profile.user.id}`);
    },
  });

  useEffect(() => api.current?.update(), [profiles.length]);

  useEffect(() => {
    const idx = usePersistStore
      .getState()
      .profiles.findIndex(({ selected }) => selected);
    if (idx >= 0 && onInit) onInit(idx);
  }, []);

  const cards = useMemo(
    () => [
      ...profiles.map((profile, i) => (
        <ProfileCard
          onPrev={onPrev}
          onNext={onNext}
          isFirst={i === 0}
          {...profile}
          key={profile.user.id}
        />
      )),
      <AddCard key={"add-card"} onPrev={onPrev} isFirst={false} isLast />,
    ],
    [profiles, onNext, onPrev]
  );

  return (
    <div className={clsx("keen-slider", classes.users)} ref={ref}>
      {cards}
    </div>
  );
};

const ManagerNotificationContent = () => {
  return (
    <div className={classes.content}>
      <Background />
      <Slides />
    </div>
  );
};

export const ManagerNotification = () => {
  return (
    <BaseNotificationBody contentClassName={classes.body}>
      <ManagerNotificationContent />
    </BaseNotificationBody>
  );
};
