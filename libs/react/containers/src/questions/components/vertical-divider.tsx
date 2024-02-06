import { default as RightArrow } from "@mui/icons-material/ChevronRightOutlined";
import { Divider } from "@mui/joy";
import type { FunctionComponent } from "react";

export const VerticalDivider: FunctionComponent = () => (
  <Divider orientation="vertical">
    <RightArrow size="lg" />
  </Divider>
);
