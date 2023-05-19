import { Grid, Link } from "@mui/joy";
import { DateTime } from "luxon";
import { TestPreview } from "./test-preview";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestPreview>;

export const Playground: Story = {
  args: {
    title: "010 - Air Law",
    status: "finished",
    score: 80,
    epochTimeInMs: DateTime.local().toMillis(),
    timeToCompleteInMs: 259000,
    timeLeftInMs: 1242414,
    numberOfQuestions: 100,
  },
  argTypes: {},
};

export const Overview: Story = {
  ...Playground,
  render: function Render(args) {
    return (
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <TestPreview {...args} title="finished" status="finished" />
        </Grid>
        <Grid xs={12} md={4}>
          <TestPreview {...args} title="started" status="started" />
        </Grid>
        <Grid xs={12} md={4}>
          <TestPreview {...args} title="created" status="created" />
        </Grid>
        <Grid xs={12} md={4}>
          <TestPreview
            {...args}
            title="finished with link"
            status="finished"
            component={Link}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <TestPreview
            {...args}
            title="started with link"
            status="started"
            component={Link}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <TestPreview
            {...args}
            title="created with link"
            status="created"
            component={Link}
          />
        </Grid>
      </Grid>
    );
  },
};

const meta: Meta<typeof TestPreview> = {
  title: "Components/TestPreview",
  component: TestPreview,
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: ["finished", "started", "created"],
      control: { type: "radio" },
    },
    score: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    component: {
      control: { type: "radio" },
      options: ["none", "Link"],
      mapping: {
        none: undefined,
        Link: Link,
      },
    },
  },
};

export default meta;
