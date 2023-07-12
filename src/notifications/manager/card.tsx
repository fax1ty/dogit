import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import clsx from "clsx";
import { HTMLAttributes } from "react";
import { mergeRefs } from "react-merge-refs";

import { useArrowNavigation, useWheelNavigation } from "../../hooks/navigation";
import classes from "./styles.module.scss";

export interface BaseCardProps {
  onPrev?: () => void;
  onNext?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

type Props = BaseCardProps & HTMLAttributes<HTMLDivElement>;

export const BaseCard = ({
  onPrev,
  onNext,
  isFirst,
  isLast,
  children,
  ...props
}: Props) => {
  const ref1 = useArrowNavigation(onPrev, onNext);
  const ref2 = useWheelNavigation(onPrev, onNext);

  return (
    <div
      {...props}
      className={clsx("keen-slider__slide", classes.card)}
      ref={mergeRefs([ref1, ref2])}
    >
      {!isFirst && (
        <CaretLeft weight="fill" className={classes.arrow} onClick={onPrev} />
      )}
      {children}
      {!isLast && (
        <CaretRight weight="fill" className={classes.arrow} onClick={onNext} />
      )}
    </div>
  );
};
