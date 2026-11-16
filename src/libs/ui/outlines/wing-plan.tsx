import type { FC, SVGProps } from "react";

export const WingPlan: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="-30 -240 606 430"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M12 135V-68L506-191 550-231 542-171 477-125 244 33 174 107Z"
        strokeWidth="2.4"
      />
      <path d="M12-53 501-177 506-191M501-177 542-171M506-191 516-166" />
      <path d="M12 78 170 62 470-142 516-166M12 94l162-16 303-203" />
      <path d="M28 96v34l63-11V90M99 89v28l65-15 9-24M187 69l16 8 66-62-15-13M265-5l14 10 66-45-14-10M391-92l15 11 66-46-6-12" />
      <path d="m45 37 43-5v42l-43 5Zm53-7 45-5v43l-45 5Zm59-7 24-14 23 27-29 22Zm34-20 30-20 23 27-30 20Zm41-28 30-20 23 27-30 20Zm42-28 30-20 23 27-30 20Z" />
      <path d="M74 117v30q7 16 14-2l5-28M174 98l4 22q9 13 15-5l6-27M284 3l9 14q9 8 12-8l-2-20" />
      <path
        d="M28-55v146M95-72V83M164-88V60M240-107l18 109M322-127l18 76M406-148l12 53"
        strokeDasharray="4 6"
        strokeWidth="0.7"
      />
      <path d="M-10 169h562M12 145v38M542-153v336m-536-8 12-12m518 12 12-12" />
      <path d="M-20 15 566-186" strokeDasharray="12 6 2 6" />
    </svg>
  );
};
