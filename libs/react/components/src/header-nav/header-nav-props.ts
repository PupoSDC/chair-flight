import type FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import type { BoxProps } from "@mui/joy";

export type HeaderNavMenuItemProps = {
  title: string;
  subtitle: string;
  href: string;
  icon: typeof FlightTakeoffIcon;
};

export type HeaderNavProps = {
  items: Array<{
    title: string;
    href: string;
    subItems?: Array<HeaderNavMenuItemProps>;
    onClick?: () => void;
  }>;
} & Partial<Pick<BoxProps, "sx" | "style" | "className">>;
