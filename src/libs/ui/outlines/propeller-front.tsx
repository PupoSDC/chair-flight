import type { FC, SVGProps } from "react";

export const PropellerFront: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="-265 -265 530 530"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle r="236" strokeDasharray="10 7 2 7" strokeWidth="0.7" />
      <circle r="222" strokeWidth="0.7" />
      {[12, 132, 252].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            d="M-9-36C-17-53-31-83-32-112C-33-145-23-189-12-215Q-7-228 1-222C12-212 18-161 17-127C17-91 11-58 9-36Z"
            strokeWidth="2"
          />
          <path d="M-25-109C-26-143-18-186-8-211" strokeWidth="0.6" />
          <path d="M-10-30v-14q10-5 20 0v14M-10-39q10-5 20 0" />
        </g>
      ))}
      <circle r="36" strokeWidth="2" />
      <circle r="30" />
      <circle r="15" strokeWidth="1.6" />
      <circle r="10" />
      <circle r="5" />
      <path d="M-260 0h520M0-260v520" strokeDasharray="12 6 2 6" />
    </svg>
  );
};
