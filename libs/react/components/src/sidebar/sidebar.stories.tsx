import { Global, css } from "@emotion/react";
import { default as AddCircleIcon } from "@mui/icons-material/AddCircle";
import { default as ConnectingAirportsIcon } from "@mui/icons-material/ConnectingAirports";
import { default as LibraryBooksIcon } from "@mui/icons-material/LibraryBooks";
import { default as SearchIcon } from "@mui/icons-material/Search";
import { default as SettingsIcon } from "@mui/icons-material/Settings";
import { Box } from "@mui/joy";
import { Sidebar } from "./sidebar";
import { SidebarListItem } from "./sidebar-list-item";
import type { SidebarProps } from "./sidebar";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Sidebar>;

export const Playground: Story = {
  args: {
    children: "5 children" as unknown as SidebarProps["children"],
  },
};

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: { type: "radio" },
      options: ["5 children", "5 children with selected"],
      mapping: {
        "5 children": [
          <SidebarListItem
            key={1}
            icon={ConnectingAirportsIcon}
            href={"#"}
            title={"Home"}
          />,
          <SidebarListItem
            key={2}
            icon={SearchIcon}
            href={"#"}
            title={"Search Questions"}
          />,
          <SidebarListItem
            key={3}
            icon={AddCircleIcon}
            href={"#"}
            title={"New Test"}
          />,
          <SidebarListItem
            key={4}
            icon={LibraryBooksIcon}
            href={"#"}
            title={"Library"}
          />,
          <SidebarListItem
            key={5}
            icon={SettingsIcon}
            href={"#"}
            title={"Options"}
          />,
        ],
        "5 children with selected": [
          <SidebarListItem
            key={1}
            icon={ConnectingAirportsIcon}
            href={"#"}
            title={"Home"}
          />,
          <SidebarListItem
            key={2}
            icon={SearchIcon}
            href={"#"}
            title={"Search Questions"}
          />,
          <SidebarListItem
            key={3}
            icon={AddCircleIcon}
            href={"#"}
            selected
            title={"New Test"}
          />,
          <SidebarListItem
            key={4}
            icon={LibraryBooksIcon}
            href={"#"}
            title={"Library"}
          />,
          <SidebarListItem
            key={5}
            icon={SettingsIcon}
            href={"#"}
            title={"Options"}
          />,
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          width: "100%",
          minHeight: "400px",
          overflow: "hidden",
        }}
      >
        <Story />
        <Global
          styles={css`
            body {
              padding: 0 !important;
            }
          `}
        />
      </Box>
    ),
  ],
};

export default meta;
