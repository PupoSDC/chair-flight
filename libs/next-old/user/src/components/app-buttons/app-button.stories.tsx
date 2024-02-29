import { Grid } from "@mui/joy";
import { GithubButton, HamburgerButton, ThemeButton } from "./app-buttons";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof GithubButton>;

/**
 * A collection of buttons that have some behavior built to them
 * and make a recurrent appearance in the app.
 */
export const Playground: Story = {
  render: () => (
    <Grid container spacing={2}>
      <Grid xs={6} sm={3} md={1}>
        <GithubButton />
      </Grid>
      <Grid xs={6} sm={3} md={1}>
        <HamburgerButton />
      </Grid>
      <Grid xs={6} sm={3} md={1}>
        <ThemeButton />
      </Grid>
    </Grid>
  ),
};

const meta: Meta<typeof GithubButton> = {
  title: "Components/AppButtons",
  component: GithubButton,
  tags: ["autodocs"],
};

export default meta;
