import { useRef } from "react";
import { SafeBox } from "../safe-box";
import type { FunctionComponent } from "react";

const BACKGROUND_COLOR = "#2a6fb5";
const LINES_COLOR = "#31a7ee";

export type QiTunnelJoystickProps = {
  position: [number, number];
  onPositionChange: (position: [number, number]) => void;
};

export const QiTunnelJoystick: FunctionComponent<QiTunnelJoystickProps> = ({
  position,
  onPositionChange: setPosition,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <SafeBox
      ref={parentRef}
      sx={{
        width: 200,
        height: 200,
        backgroundColor: BACKGROUND_COLOR,
        position: "relative",

        "& svg": {
          position: "absolute",
        },
      }}
      onMouseMove={(e) => {
        const maxDistance = 70;
        const normalizedDistance = 100;
        if (e.buttons !== 1) return;
        if (!parentRef.current) return;
        const parentRect = parentRef.current.getBoundingClientRect();
        const relativeX = e.clientX - parentRect.left;
        const relativeY = e.clientY - parentRect.top;
        const x = relativeX - 100;
        const y = relativeY - 100;
        const distance = Math.sqrt(x * x + y * y);
        const angle = Math.atan2(y, x);
        setPosition([
          ((Math.cos(angle) * Math.min(distance, maxDistance)) / maxDistance) *
            normalizedDistance,
          ((Math.sin(angle) * Math.min(distance, maxDistance)) / maxDistance) *
            normalizedDistance,
        ]);
      }}
      onMouseUp={() => {
        setPosition([0, 0]);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="200"
        height="200"
      >
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke={LINES_COLOR}
          stroke-width="2"
        />
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke={LINES_COLOR}
          stroke-width="2"
        />
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke={LINES_COLOR}
          stroke-width="2"
        />
        <rect
          x="90"
          y="0"
          width="20"
          height="200"
          fill={BACKGROUND_COLOR}
          stroke-width="0"
        />
        <rect
          x="0"
          y="90"
          width="200"
          height="20"
          fill={BACKGROUND_COLOR}
          stroke-width="0"
        />
        <line
          x1="20"
          y1="100"
          x2="90"
          y2="100"
          stroke={LINES_COLOR}
          stroke-width="2"
        />
        <line
          x1="110"
          y1="100"
          x2="180"
          y2="100"
          stroke={LINES_COLOR}
          stroke-width="2"
        />
        <line
          y1="20"
          x1="100"
          y2="90"
          x2="100"
          stroke={LINES_COLOR}
          stroke-width="2"
        />
        <line
          y1="110"
          x1="100"
          y2="180"
          x2="100"
          stroke={LINES_COLOR}
          stroke-width="2"
        />
      </svg>
      <SafeBox
        children={<div />}
        style={{
          top: 100 + (position[1] / 100) * 70,
          left: 100 + (position[0] / 100) * 70,
        }}
        sx={{
          position: "absolute",
          width: 0,
          height: 0,

          "& div": {
            content: '""',
            transform: "translate(-15px, -15px)",
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "#fff",
          },
        }}
      />
    </SafeBox>
  );
};
