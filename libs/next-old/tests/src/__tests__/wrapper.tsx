import { ThemeProvider } from "@cf/react/theme";
import { trpc } from "@cf/trpc/client";
import type { FunctionComponent, ReactNode } from "react";

const BaseWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <ThemeProvider>{children}</ThemeProvider>;

export const wrapper = trpc.withTRPC(BaseWrapper);
