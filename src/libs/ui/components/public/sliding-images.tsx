import { cn } from "../../utils/cn";
import type { FC } from "react";

const IMAGES = [
  "fighter",
  "office",
  "tower",
  "cessna",
  "student",
  "cockpit",
  "hangar",
  "engine",
  "aeroplane",
];

const COLUMNS = [
  { order: [0, 1, 2, 3, 4, 5, 6, 7, 8], seconds: 30, reverse: false },
  { order: [6, 7, 2, 3, 4, 5, 8, 0, 1], seconds: 27, reverse: true },
  { order: [1, 4, 7, 0, 3, 6, 2, 5, 8], seconds: 21, reverse: false },
] as const;

const COLUMN_CLASS_NAMES = ["flex", "hidden md:flex", "hidden lg:flex"];

export const SlidingImages: FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 flex justify-end overflow-hidden"
    >
      {COLUMNS.map(({ order, seconds, reverse }, column) => (
        <div
          key={column}
          className={cn(
            "w-80 flex-none overflow-hidden pr-4",
            COLUMN_CLASS_NAMES[column],
          )}
        >
          <div
            className={cn(
              "flex flex-col animate-slide motion-reduce:animate-none",
              reverse && "[animation-direction:reverse]",
            )}
            style={{ animationDuration: `${seconds}s` }}
          >
            {[...order, ...order].map((image, index) => (
              <img
                key={index}
                src={`/images/home/${IMAGES[image]}.png`}
                alt=""
                width={320}
                height={320}
                className={cn("size-80 flex-none", `sliding-fade-${column}`)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
