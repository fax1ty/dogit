import { useEffect } from "react";
import { mutate } from "swr";

import { usePersistStore } from "../store/persist";

const setIntervalImmediate = (cb: () => void, interval: number) => {
  cb();
  return setInterval(cb, interval);
};

export const Syncronizer = () => {
  const selectedId = usePersistStore((state) => state.selectedId);

  useEffect(() => {
    const interval = setIntervalImmediate(() => {
      const profiles = usePersistStore.getState().profiles;
      const selected = profiles.find(({ selected }) => selected);

      if (!selected) return;

      (async () => {
        if (selected.type === "local") await mutate("/local-profile");
        else if (selected.type === "github")
          await mutate(`/github-profile/${selected.user.id}`);
      })();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedId]);

  return null;
};
