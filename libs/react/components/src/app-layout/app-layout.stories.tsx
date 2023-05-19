import { Global, css } from "@emotion/react";
import { Typography } from "@mui/joy";
import { Header } from "../header/header";
import { AppLayout } from "./app-layout";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AppLayout.Main> = {
  title: "demos/AppLayout",
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
        <Typography level="body1">
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
        <AppLayout.Grid>
          <AppLayout.Column xs={8}>
            <AppLayout.Header>
              <Typography level="h2">Hello World</Typography>
            </AppLayout.Header>
            <AppLayout.ScrollableContainer>
              <Typography level="body1">
                This is a more opinionated layout
              </Typography>
            </AppLayout.ScrollableContainer>
          </AppLayout.Column>
          <AppLayout.Column xs={4}>
            <AppLayout.Header>
              <Typography level="h2">Hello World</Typography>
            </AppLayout.Header>
            <AppLayout.ScrollableContainer>
              <Typography level="body1">
                This is a more opinionated layout
              </Typography>
            </AppLayout.ScrollableContainer>
          </AppLayout.Column>
        </AppLayout.Grid>
      </AppLayout.Main>
    </>
  ),
};

export default meta;
