import { Link, Stack, Typography } from "@mui/joy";
import { AppLogo } from "@cf/react/web";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export const AppPublicFooter: FunctionComponent<
  Omit<StackProps, "children">
> = ({ component = "footer", sx, ...props }) => {
  return (
    <Stack
      component={component}
      sx={{ alignItems: "center", ...sx }}
      {...props}
    >
      <AppLogo sx={{ width: 52, height: 52, my: 2 }} color="primary" />

      <Stack
        gap={2}
        alignItems={"center"}
        sx={{ my: 2 }}
        direction={{ md: "row" }}
      >
        <Link href={"/blog"}>Github</Link>
        <Link href={"/content"}>Content</Link>
        <Link href={"/blog"}>Blog</Link>
        <Link href={"/about-us"}>About Us</Link>
      </Stack>
      <Typography sx={{ my: 2 }}>
        Chair Flight is a community driven Aviation Question Bank built by
        students for students.
      </Typography>
    </Stack>
  );
};
