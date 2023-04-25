import FlightClassIcon from "@mui/icons-material/FlightClass";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { default as ListIcon } from "@mui/icons-material/List";
import { default as QuestionAnswerIcon } from "@mui/icons-material/QuestionAnswer";
import { Box } from "@mui/joy";
import { HeaderNavDesktop as HeaderNavDesktopComponent } from "./header-nav-desktop";
import { HeaderNavMobile as HeaderNavMobileComponent } from "./header-nav-mobile";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof HeaderNavDesktopComponent>;

export const HeaderNavDesktop: Story = {
  args: {
    items: [
      {
        title: "Flights",
        href: "#",
        subItems: [
          {
            title: "Book a flight",
            subtitle: "Make a new reservation for a flight",
            href: "#",
            icon: FlightTakeoffIcon,
          },
          {
            title: "Flights",
            subtitle: "Manage your flights: Change seats, check-in, etc...",
            href: "#",
            icon: FlightClassIcon,
          },
        ],
      },
      {
        title: "Question Bank",
        href: "#",
        subItems: [
          {
            icon: QuestionAnswerIcon,
            title: "Questions",
            subtitle: "Search chair-flights 30.000+ questions",
            href: "#",
          },
          {
            icon: ListIcon,
            title: "Learning Objectives",
            subtitle: "Explore EASA official Learning Objectives",
            href: "#",
          },
        ],
      },
    ],
  },
};

export const HeaderNavMobile: Story = {
  args: HeaderNavDesktop.args,
  render: (args) => (
    <Box sx={{ width: 420 }}>
      <HeaderNavMobileComponent {...args} />
    </Box>
  ),
};

const meta: Meta<typeof HeaderNavDesktopComponent> = {
  title: "Components/HeaderNav",
  component: HeaderNavDesktopComponent,
  tags: ["autodocs"],
};

export default meta;
