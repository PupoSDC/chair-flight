"use client";

import { FunctionComponent, HTMLAttributes, forwardRef, useEffect, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";

const radiansToDegrees = (angle: number) => angle * (180 / Math.PI);

export const AirplanesAnimation = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const [planes, setPlanes] = useState(() => [
    { "x": 50, "y": 50, "vx": 0.3, "vy": 0.5 },
    { "x": 32, "y": 23, "vx": 0.4, "vy": 0.6 },
    { "x": 0, "y": 27,  "vx": -0.3, "vy": 0.55 },
    { "x": 35, "y": 90, "vx": -0.5, "vy": 0.5 },
    { "x": 31, "y": 67, "vx": 0.1, "vy": -0.9 },
    { "x": 70, "y": 30, "vx": 0.6, "vy": -0.3 },
    { "x": 90, "y": 70, "vx": -0.7, "vy": 0.3 },
    { "x": 80, "y": 90, "vx": -0.5, "vy": -0.5 },
    { "x": 90, "y": 10, "vx": 0.5, "vy": 0.5 },
    { "x": 10, "y": 10, "vx": 0.5, "vy": 0.5 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlanes((planes) => planes.map((plane) => {
          const newX = plane.x + plane.vx;
          const newY = plane.y + plane.vy;
          return {
            x: newX,
            y: newY,
            vx: (newX > 110 || newX < -20) ? -plane.vx : plane.vx,
            vy: (newY > 110 || newY < -20) ? -plane.vy : plane.vy,
          }
      }));
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      {...props}
      ref={ref}
      className={cn("overflow-hidden", props.className)}
    >
      {planes.map((plane, i) => (
        <PaperAirplaneIcon
          key={i}
          className={cn(
            "absolute",
            "w-10",
            "text-primary-400",
            "animate-float",
            "z-10",
            "opacity-60",
            "transform",
            "rotate-45",
            "hover:rotate-90",
            "transition-transform",
            "duration-300",
            "ease-in-out",
            "cursor-pointer",
          )}
          style={{
            left: `${plane.x}%`,
            top: `${plane.y}%`,
            transform: `rotate(${
              radiansToDegrees(Math.atan2(plane.vy, plane.vx)) 
            }deg)`,
          }}
        />
      ))}

    </div>
  );
});

AirplanesAnimation.displayName = "AirplanesAnimation";