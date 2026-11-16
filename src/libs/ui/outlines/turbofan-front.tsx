import type { FC, SVGProps } from "react";

export const TurbofanFront: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="-300 -300 600 600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle r="235" strokeWidth="0.7" />
      <circle r="231" strokeDasharray="10 4" />
      <circle r="226" strokeWidth="1.6" />
      <circle r="220" />
      <circle r="216" strokeWidth="2" />
      <circle r="212" strokeWidth="0.7" />
      {Array.from({ length: 18 }, (_, index) => (
        <g key={index} transform={`rotate(${index * 20})`}>
          <path d="M60-8C98-9 122-23 153-25S193-23 211-20L212-14C190-18 171-20 151-20S97-3 60-3Z" />
          <path d="M63-6C102-7 126-24 154-23S193-21 211-17" strokeWidth="0.6" />
          <path d="M227-2h7" strokeWidth="0.7" />
        </g>
      ))}
      <circle r="62" strokeWidth="1.6" />
      <circle r="58" />
      <circle r="53" strokeWidth="0.7" />
      <circle r="23" strokeWidth="2" />
      <circle r="20" strokeWidth="0.7" />
      <path d="M-285 0h570M0-285v570" strokeDasharray="12 6 2 6" />
      <path d="M-233 262v35M233 262v35M-233 285h466m-472 6 12-12m454 12 12-12" />
    </svg>
  );
};
