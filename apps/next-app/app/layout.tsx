import { Stack } from "@mui/joy";
import { TrpcProvider } from "@cf/trpc/client";
import { UserBugReport } from "./_client/user-bug-report";
import { LayoutThemeRegistry } from "./layout-theme-registry";
import { LayoutThemeScript } from "./layout-theme-script";

export const metadata = {
  title: "Chair Flight",
  description: [
    "Chair Flight is a community driven Aviation Question Bank built by students",
    "for students. Prepare yourself for your ATPL exams, Interviews, and type",
    "rating technical exams. For Free!",
  ].join(" "),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProvider>
      <html lang="en">
        <head>
          <LayoutThemeScript />
        </head>
        <Stack component="body">
          <LayoutThemeRegistry>
            {children}
            <UserBugReport />
          </LayoutThemeRegistry>
        </Stack>
      </html>
    </TrpcProvider>
  );
}
