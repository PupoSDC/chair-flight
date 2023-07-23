import { Box, Button, Link, Typography } from "@mui/joy";
import { Toaster, toast } from "./toaster";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Toaster>;

export const Playground: Story = {
  args: {
    sx: { width: "100%", height: "2em", my: 1 },
  },
  argTypes: {},
  render: (args) => (
    <>
      <Toaster {...args} />
      <Box>
        <Button
          onClick={() => toast("Normal Toast")}
          children="Normal toast"
          color="primary"
          sx={{ mx: 1 }}
        />
        <Button
          onClick={() => toast.error("Error Toast")}
          children="Error toast"
          color="danger"
          sx={{ mx: 1 }}
        />
        <Button
          onClick={() => toast.warn("Warning Toast")}
          children="Error toast"
          color="warning"
          sx={{ mx: 1 }}
        />
        <Button
          onClick={() => toast.success("Success Toast")}
          children="Success toast"
          color="success"
          sx={{ mx: 1 }}
        />
        <Button
          onClick={() =>
            toast.promise(
              () => new Promise<string>((r) => setTimeout(r, 2000)),
              {
                loading: "loading",
                success: "Success!",
                error: "failed",
              },
            )
          }
          children="Loading toast"
          color="info"
          sx={{ mx: 1 }}
        />
        <Button
          onClick={() =>
            toast.promise(
              () => new Promise<string>((r) => setTimeout(r, 2000)),
              {
                loading: "loading",
                error: "failed",
                success: () => (
                  <Typography>
                    Success! <Link href="#">Click here</Link>
                  </Typography>
                ),
              },
            )
          }
          children="success with link toast"
          color="success"
          sx={{ mx: 1 }}
        />
      </Box>
    </>
  ),
};

const meta: Meta<typeof Toaster> = {
  title: "Components/Toaster",
  component: Toaster,
  tags: ["autodocs"],
};

export default meta;
