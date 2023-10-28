import { Global, css } from "@emotion/react";
import { Sheet, Typography } from "@mui/joy";
import { Header } from "../header/header";
import { AppLayout } from "./app-layout";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AppLayout.Main> = {
  title: "Components/AppLayout",
  component: AppLayout.Main,
};

type Story = StoryObj<typeof AppLayout.Main>;

export const BasicLayout: Story = {
  render: () => (
    <>
      <Global
        styles={css`
          body {
            padding: 0 !important;
          }
        `}
      />
      <Header />
      <AppLayout.Main>
        <Typography level="h1">Hello World</Typography>
        <Typography level="body-md">
          This is the least opinionated layout
        </Typography>
      </AppLayout.Main>
    </>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <>
      <Global
        styles={css`
          body {
            padding: 0 !important;
          }
        `}
      />
      <Header />
      <AppLayout.Main>
        <AppLayout.MainGrid>
          <AppLayout.MainGridFixedColumn xs={8}>
            <AppLayout.Header>
              <Typography level="h2">Hello World</Typography>
            </AppLayout.Header>
          </AppLayout.MainGridFixedColumn>
          <AppLayout.MainGridScrollableColumn xs={4}>
            <Typography level="h2" sx={{ pt: 2 }}>
              This section Can be scrolled
            </Typography>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
              <Sheet sx={{ my: 1, p: 2 }} key={i}>
                <Typography level="h3">Card number {i}</Typography>
              </Sheet>
            ))}
          </AppLayout.MainGridScrollableColumn>
        </AppLayout.MainGrid>
      </AppLayout.Main>
    </>
  ),
};

export default meta;
