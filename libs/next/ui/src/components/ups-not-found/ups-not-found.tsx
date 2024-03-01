"use client";

import { Link, Typography } from "@mui/joy";
import { useBugReportDisclose } from "@cf/next/user";
import { Ups } from "@cf/react/ui";
import type { FunctionComponent } from "react";

export const UpsNotFound: FunctionComponent = () => {
  const { open } = useBugReportDisclose();
  return (
    <Ups message="Not found">
      <Typography level="body-lg">
        If you just made a turn in the wrong taxiway, consider{" "}
        <Link href="/" children="going back to the Hangar" />.
      </Typography>
      <Typography level="body-lg">
        If you think this content should exist, but does not, consider{" "}
        <Link onClick={open} children="reporting a bug" component="span" />.
      </Typography>
    </Ups>
  );
};
