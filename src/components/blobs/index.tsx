import clsx from "clsx";
import { type HTMLAttributes } from "react";

import classes from "./styles.module.scss";

type Props = {
  colors?: [string, string, string] | readonly [string, string, string];
  speed?: "normal" | "fast";
} & HTMLAttributes<HTMLDivElement>;

export const Blobs = ({
  colors = ["#000AFF", "#DB00FF", "#00A3FF"],
  speed = "normal",
  ...props
}: Props) => {
  return (
    <div {...props}>
      <svg
        width={800}
        height={450}
        viewBox="0 0 800 450"
        fill="none"
        className={clsx(classes.blobs, speed === "fast" && classes.fast)}
      >
        <g clipPath="url(#clip0_92_335)">
          <rect width="800" height="450" fill="#232324" />
          <g filter="url(#filter0_f_92_335)">
            <path
              d="M273.999 346.995C273.999 346.995 347.999 333.995 326.499 271.995C304.999 209.995 242.999 233.995 366.499 221.495C489.999 208.995 475.499 278.995 475.499 278.995C475.499 278.995 423.499 361.495 554.499 295.495C685.499 229.495 714.499 426.995 714.499 426.995L546.499 526.995C546.499 526.995 588.999 468.495 546.499 439.495C503.999 410.495 457.499 459.495 371.999 426.995C286.499 394.495 273.999 346.995 273.999 346.995Z"
              fill={colors[0]}
              className={classes.one}
            />
            <path
              d="M489.107 16.3865C489.107 16.3865 571.876 70.6842 629.89 -23.3691C687.904 -117.422 602.203 -147.316 728.866 -45.7538C855.529 55.808 703.558 122.17 643.955 116.272C584.353 110.374 544.978 177.373 745.131 222.339C945.284 267.304 785.459 526.899 785.459 526.899C785.459 526.899 676.6 659.792 560.596 508.038C444.592 356.284 620.818 457.963 618.776 383.382C616.734 308.801 477.861 362.989 441.513 243.702C405.166 124.415 489.107 16.3865 489.107 16.3865Z"
              fill={colors[1]}
              className={classes.two}
            />
            <path
              d="M-166.578 296.281C-180.647 225.034 -68.2888 284.523 -84.4707 175.208C-100.653 65.8927 -185.469 98.2099 -23.1627 94.3458C139.144 90.4817 67.8226 197.944 67.8226 197.944C67.8226 197.944 28.4655 377.703 210.551 283.214C392.636 188.726 388.898 496.018 388.898 496.018L152.494 643.516C152.494 643.516 218.545 549.299 168.956 493.555C119.367 437.811 49.9224 515.178 -54.701 447.322C-159.324 379.466 -152.508 367.529 -166.578 296.281Z"
              fill={colors[2]}
              className={classes.three}
            />
          </g>
          <g filter="url(#filter1_f_92_335)">
            <path
              d="M53.9999 95C53.9999 95 128 82 106.5 20C84.9999 -42 22.9999 -18 146.5 -30.5C270 -43 255.5 27 255.5 27C255.5 27 203.5 109.5 334.5 43.5C465.5 -22.5 494.5 175 494.5 175L326.5 275C326.5 275 369 216.5 326.5 187.5C284 158.5 237.5 207.5 152 175C66.4999 142.5 53.9999 95 53.9999 95Z"
              fill={colors[0]}
              className={classes.two}
            />
            <path
              d="M392.156 25.9594C392.156 25.9594 369.996 122.437 478.346 144.162C586.696 165.886 584.953 75.1382 533.722 229.196C482.491 383.253 367.466 263.803 352.289 205.864C337.113 147.925 260.608 134.279 287.979 337.587C315.351 540.894 16.4004 481.212 16.4004 481.212C16.4004 481.212 -146.034 425.303 -44.0344 263.803C57.9656 102.303 23.8436 302.877 93.0694 275.052C162.295 247.226 63.2364 135.828 162.466 60.3031C261.695 -15.2223 392.156 25.9594 392.156 25.9594Z"
              fill={colors[1]}
              className={classes.three}
            />
            <path
              d="M586.497 338.783C616.979 404.699 493.757 373.399 535.273 475.81C576.79 578.221 651.587 526.805 494.775 568.854C337.962 610.903 381.915 489.648 381.915 489.648C381.915 489.648 377.749 305.678 223.098 440.459C68.4464 575.241 -0.42229 275.742 -0.42229 275.742L194.507 76.6318C194.507 76.6318 152.55 183.773 213.891 226.243C275.233 268.713 324.463 177.146 442.142 218.402C559.822 259.658 556.014 272.866 586.497 338.783Z"
              fill={colors[2]}
              className={classes.one}
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_92_335"
            x="-302.8"
            y="-244.208"
            width="1283.7"
            height="1022.72"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="67.5"
              result="effect1_foregroundBlur_92_335"
            />
          </filter>
          <filter
            id="filter1_f_92_335"
            x="-212.682"
            y="-166.995"
            width="939.084"
            height="879.71"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="67.5"
              result="effect1_foregroundBlur_92_335"
            />
          </filter>
          <clipPath id="clip0_92_335">
            <rect width="800" height="450" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <div className={classes.noise} />
    </div>
  );
};
