import { Box, Button, Stack } from "@mui/joy";
import { Toaster, toast } from "./toaster";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Toaster>;

export const Playground: Story = {
  render: (args) => (
    <Box sx={{ height: 400 }}>
      <Toaster {...args} />
      <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
        <Button
          onClick={() => toast({ content: "Normal Toast" })}
          children="Normal toast"
          color="primary"
          sx={{ m: 1 }}
        />
        <Button
          onClick={() => toast({ content: "Error Toast", color: "danger" })}
          children="Error toast"
          color="danger"
          sx={{ m: 1 }}
        />
        <Button
          onClick={() => toast({ content: "Warning Toast", color: "warning" })}
          children="Error toast"
          color="warning"
          sx={{ m: 1 }}
        />
        <Button
          onClick={() => toast({ content: "Success Toast", color: "success" })}
          children="Success toast"
          color="success"
          sx={{ m: 1 }}
        />
        <Button
          onClick={() =>
            toast({
              content: "Something went well. Congrats!",
              action: {
                text: "Click me to fire another toast!",
                onClick: () =>
                  toast({
                    content: "this was triggered by the action!",
                  }),
              },
            })
          }
          children="With action"
          sx={{ m: 1 }}
        />
        <Button
          onClick={() =>
            toast({
              content: "Something went well. Congrats!",
              onAutoClose: () =>
                toast({
                  content: "this was triggered by the action!",
                }),
            })
          }
          children="With autoclose callback"
          sx={{ m: 1 }}
        />
      </Stack>
    </Box>
  ),
};

const meta: Meta<typeof Toaster> = {
  title: "Components/Toaster",
  component: Toaster,
  tags: ["autodocs"],
};

export default meta;
