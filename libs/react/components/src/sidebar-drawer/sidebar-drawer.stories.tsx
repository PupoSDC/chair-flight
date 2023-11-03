import { Global, css } from "@emotion/react";
import { default as AddCircleIcon } from "@mui/icons-material/AddCircle";
import { default as ConnectingAirportsIcon } from "@mui/icons-material/ConnectingAirports";
import { default as LibraryBooksIcon } from "@mui/icons-material/LibraryBooks";
import { default as SearchIcon } from "@mui/icons-material/Search";
import { default as SettingsIcon } from "@mui/icons-material/Settings";
import { Box } from "@mui/joy";
import type { SidebarDrawerProps } from "./sidebar-drawer";
import { SidebarDrawer } from "./sidebar-drawer";
import { SidebarDrawerListItem } from "./sidebar-drawer-list-item";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof SidebarDrawer>;

export const Playground: Story = {
  args: {
    children: "5 children" as unknown as SidebarDrawerProps["children"],
  },
  render: (args) => (
    <>
      <SidebarDrawer {...args} key={1} />
      <Box sx={{ minHeight: 400 }} />
      <Global
        styles={css`
          body {
            padding: 0 !important;
          }
        `}
      />
    </>
  ),
};

const meta: Meta<typeof SidebarDrawer> = {
  title: "Components/SidebarDrawer",
  component: SidebarDrawer,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: { type: "radio" },
      options: ["5 children", "5 children with selected"],
      mapping: {
        "5 children": [
          <SidebarDrawerListItem
            key={1}
            icon={ConnectingAirportsIcon}
            href={"#"}
            title={"Home"}
          />,
          <SidebarDrawerListItem
            key={2}
            icon={SearchIcon}
            href={"#"}
            title={"Search Questions"}
          />,
          <SidebarDrawerListItem
            key={3}
            icon={AddCircleIcon}
            href={"#"}
            title={"New Test"}
          />,
          <SidebarDrawerListItem
            key={4}
            icon={LibraryBooksIcon}
            href={"#"}
            title={"Library"}
          />,
          <SidebarDrawerListItem
            key={5}
            icon={SettingsIcon}
            href={"#"}
            title={"Options"}
          />,
        ],
        "5 children with selected": [
          <SidebarDrawerListItem
            key={1}
            icon={ConnectingAirportsIcon}
            href={"#"}
            title={"Home"}
          />,
          <SidebarDrawerListItem
            key={2}
            icon={SearchIcon}
            href={"#"}
            title={"Search Questions"}
          />,
          <SidebarDrawerListItem
            key={3}
            icon={AddCircleIcon}
            href={"#"}
            selected
            title={"New Test"}
          />,
          <SidebarDrawerListItem
            key={4}
            icon={LibraryBooksIcon}
            href={"#"}
            title={"Library"}
          />,
          <SidebarDrawerListItem
            key={5}
            icon={SettingsIcon}
            href={"#"}
            title={"Options"}
          />,
        ],
      },
    },
  },
};

export default meta;
