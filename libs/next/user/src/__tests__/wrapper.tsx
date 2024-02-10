import { ThemeProvider } from "@chair-flight/react/theme";
import { trpc } from "@chair-flight/trpc/client";
import type { FunctionComponent, ReactNode } from "react";

const BaseWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <ThemeProvider>{children}</ThemeProvider>;

export const wrapper = trpc.withTRPC(BaseWrapper);
