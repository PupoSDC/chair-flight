"use client";

import { forwardRef } from "react";
import { Box, SvgIcon } from "@mui/joy";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent } from "react";

const AppLogoSvg: FunctionComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.0"
    x="0px"
    y="0px"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    fill="#6FB6FF"
    {...props}
  >
    <path d="M 1.898438 11.621094 C 1.902344 11.570312 1.898438 11.515625 1.949219 11.5 C 2.242188 11.410156 3.234375 11.6875 3.417969 11.734375 C 3.632812 11.789062 3.902344 11.855469 4.097656 11.976562 C 4.195312 12.449219 4.292969 12.78125 4.453125 13.300781 C 3.566406 13.359375 2.667969 13 2.535156 12.945312 C 2.308594 12.855469 2.164062 12.738281 2.046875 12.527344 C 1.925781 12.3125 1.855469 11.996094 1.898438 11.621094 Z M 1.898438 11.621094 " />
    <path d="M 1.71875 12.613281 C 1.550781 12.546875 1.265625 12.390625 0.84375 12.117188 C 0.4375 11.859375 0.824219 11.65625 0.949219 11.566406 C 1.152344 11.425781 1.535156 11.148438 1.734375 11.089844 C 1.535156 11.480469 1.46875 12.21875 1.71875 12.613281 Z M 1.71875 12.613281 " />
    <path d="M 3.949219 0.191406 C 5.074219 -0.0625 7.082031 2.765625 8.058594 4.890625 C 8.597656 6.058594 9.640625 9.074219 10.074219 10.855469 C 10.207031 11.398438 10.683594 11.558594 11.242188 11.613281 C 11.496094 11.640625 12.53125 11.746094 13.828125 11.742188 C 16.875 11.734375 22.066406 11.632812 22.515625 11.613281 L 22.523438 11.65625 C 20.765625 11.875 16.699219 12.441406 15.847656 12.59375 C 13.96875 12.925781 13.285156 13.101562 11.671875 13.695312 C 11.375 13.800781 10.851562 14.089844 11.109375 14.863281 C 11.519531 16.070312 11.699219 17.859375 11.773438 18.882812 C 12.042969 22.515625 10.695312 23.578125 10.265625 23.644531 C 9.960938 23.6875 9.269531 23.390625 8.722656 22.628906 C 6.167969 19.074219 3.960938 11.089844 3.53125 6.933594 C 3.414062 5.820312 2.648438 0.488281 3.949219 0.191406 Z M 5.117188 2.917969 C 4.261719 2.839844 3.609375 3.410156 3.609375 4.257812 C 3.609375 4.964844 4.261719 5.757812 5.117188 5.835938 C 5.96875 5.914062 6.664062 5.367188 6.664062 4.519531 C 6.664062 3.671875 5.96875 2.996094 5.117188 2.917969 Z M 9.78125 19.21875 C 9 18.847656 8.15625 18.964844 7.816406 19.5 C 7.535156 19.949219 7.835938 20.695312 8.617188 21.070312 C 9.394531 21.441406 10.273438 21.355469 10.613281 20.820312 C 10.953125 20.28125 10.5625 19.589844 9.78125 19.21875 Z M 9.78125 19.21875 " />
    <path d="M 5.277344 5.226562 C 5.242188 5.226562 5.207031 5.226562 5.171875 5.222656 C 4.648438 5.175781 4.226562 4.65625 4.226562 4.257812 C 4.226562 3.8125 4.515625 3.527344 4.960938 3.527344 C 4.992188 3.527344 5.027344 3.527344 5.058594 3.53125 C 5.613281 3.582031 6.050781 4.015625 6.050781 4.519531 C 6.050781 5.042969 5.632812 5.226562 5.277344 5.226562 Z M 4.914062 4.125 C 4.792969 4.230469 4.792969 4.429688 4.914062 4.574219 C 5.035156 4.714844 5.234375 4.746094 5.355469 4.644531 C 5.476562 4.539062 5.476562 4.339844 5.355469 4.195312 C 5.234375 4.054688 5.039062 4.023438 4.914062 4.125 Z M 4.914062 4.125 " />
    <path d="M 10.136719 20.527344 C 10.003906 20.867188 9.484375 20.984375 8.980469 20.789062 C 8.472656 20.589844 8.171875 20.148438 8.308594 19.804688 C 8.445312 19.460938 8.960938 19.34375 9.46875 19.542969 C 9.972656 19.742188 10.273438 20.183594 10.136719 20.527344 Z M 9.269531 19.898438 C 9.039062 19.816406 8.808594 19.871094 8.753906 20.015625 C 8.703125 20.164062 8.847656 20.347656 9.078125 20.429688 C 9.308594 20.515625 9.539062 20.460938 9.589844 20.316406 C 9.644531 20.167969 9.5 19.980469 9.269531 19.898438 Z M 9.269531 19.898438 " />
    <path d="M 22.046875 9.492188 C 21.792969 8.761719 21.703125 8.628906 21.457031 8.226562 C 21.0625 7.570312 20.605469 7.496094 20.128906 7.65625 C 19.8125 7.761719 19.445312 8.226562 19.304688 9.058594 C 19.242188 9.4375 19.28125 10.167969 19.363281 10.726562 C 19.273438 10.734375 16.257812 10.621094 15.835938 10.589844 C 15.410156 10.558594 12.535156 10.523438 12.191406 10.527344 C 11.851562 10.53125 10.941406 10.507812 10.367188 10.527344 C 10.507812 11.132812 10.699219 11.199219 11.410156 11.257812 C 11.613281 11.277344 12.683594 11.375 13.996094 11.371094 C 16.972656 11.363281 20.679688 11.371094 21.328125 11.339844 C 21.652344 11.324219 22.125 11.34375 22.460938 11.316406 C 22.367188 10.714844 22.097656 9.644531 22.046875 9.492188 Z M 22.046875 9.492188 " />
    <path d="M 23.503906 9.894531 C 23.460938 9.546875 22.921875 9.390625 22.390625 9.441406 C 22.585938 10.105469 22.703125 10.542969 22.8125 11.257812 C 23.101562 11.054688 23.613281 10.726562 23.503906 9.894531 Z M 23.503906 9.894531 " />
    <path d="M 22.796875 12.933594 C 22.757812 12.636719 22.707031 12.4375 22.585938 11.992188 C 21.707031 12.136719 20.433594 12.292969 19.8125 12.351562 C 19.964844 12.683594 20.140625 12.953125 20.351562 13.214844 C 20.996094 14.011719 21.480469 14.347656 22.289062 14.347656 C 22.601562 14.347656 22.804688 14.023438 22.824219 13.855469 C 22.84375 13.695312 22.867188 13.453125 22.796875 12.933594 Z M 22.796875 12.933594 " />
    <path d="M 3.996094 11.539062 C 3.929688 11.332031 3.832031 10.828125 3.832031 10.828125 C 3.703125 10.773438 2.3125 10.851562 2.132812 10.976562 C 2.101562 11.011719 2.078125 11.066406 2.046875 11.148438 C 2.992188 11.175781 3.542969 11.410156 3.996094 11.539062 Z M 3.996094 11.539062 " />
    <path d="M 2.308594 10.65625 C 2.25 10.320312 2.1875 10.042969 2.121094 9.773438 C 1.875 8.734375 1.707031 8.648438 1.566406 8.648438 L 1.542969 8.648438 C 1.398438 8.664062 1.246094 8.773438 1.242188 9.859375 C 1.238281 10.195312 1.253906 10.605469 1.28125 11.027344 C 1.359375 10.980469 1.472656 10.921875 1.574219 10.875 C 1.515625 9.902344 1.515625 9.222656 1.582031 8.984375 C 1.699219 9.195312 1.871094 9.796875 2.039062 10.726562 C 2.105469 10.703125 2.226562 10.667969 2.308594 10.65625 Z M 2.308594 10.65625 " />
    <path d="M 2.355469 13.148438 C 2.464844 14.457031 2.445312 15.386719 2.367188 15.667969 C 2.210938 15.390625 1.953125 14.40625 1.75 12.898438 C 1.738281 12.898438 1.554688 12.832031 1.464844 12.785156 C 1.566406 13.574219 1.691406 14.316406 1.828125 14.882812 C 2.074219 15.917969 2.242188 16.007812 2.382812 16.007812 L 2.40625 16.003906 C 2.550781 15.988281 2.703125 15.878906 2.707031 14.796875 C 2.710938 14.359375 2.6875 13.839844 2.640625 13.269531 C 2.578125 13.253906 2.429688 13.1875 2.355469 13.148438 Z M 2.355469 13.148438 " />
  </svg>
);

const AppLogoUncast = forwardRef<HTMLElement, BoxProps>((props, ref) => (
  <Box
    {...props}
    ref={ref}
    sx={{
      display: "flex",
      verticalAlign: "center",
      alignItems: "center",
      textDecoration: "none",

      "& > h2": {
        fontSize: "14px",
        ml: 2,
        fontWeight: 700,
        letterSpacing: "0.05rem",
        color: "neutral.plainColor",
      },

      "& > svg": {
        width: "25px",
        height: "25px",
        fill: "var(--joy-palette-primary-plainColor)",
      },

      ...props.sx,
    }}
  >
    <SvgIcon component={AppLogoSvg} />
    <h2>CHAIR FLIGHT</h2>
  </Box>
));

AppLogoUncast.displayName = "AppLogo";

export const AppLogo = AppLogoUncast as typeof Box;
