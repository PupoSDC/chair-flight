import { useState } from "react";
import { Button, Stack } from "@mui/joy";
import { ContainerWrapper } from "./container-wrapper";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof ContainerWrapper>;

export const Playground: Story = {};

const ComponentToDemoWrapper = () => {
  const [hasError, setHasError] = useState(false);
  const [hasSuspended, setHasSuspended] = useState(false);

  if (hasError) {
    throw new Error();
  }
  if (hasSuspended) {
    throw new Promise(() => {});
  }

  return (
    <Stack gap={2}>
      <Button color="danger" onClick={() => setHasError(true)}>
        Click me to trigger Error Boundary!
      </Button>
      <Button color="success" onClick={() => setHasSuspended(true)}>
        Click me to trigger Suspense!
      </Button>
    </Stack>
  );
};

const meta: Meta<typeof ContainerWrapper> = {
  title: "Components/ContainerWrapper",
  component: ContainerWrapper,
  tags: ["autodocs"],
  args: {
    children: <ComponentToDemoWrapper />,
  },
};

export default meta;
