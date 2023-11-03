import { forwardRef } from "react";
import {
  Link,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import type { default as SearchIcon } from "@mui/icons-material/Search";

export type SidebarDrawerListItemProps = {
  icon: typeof SearchIcon;
  href: string;
  title: string;
  selected?: boolean;
  onClick?: () => void;
};

export const SidebarDrawerListItem = forwardRef<
  HTMLAnchorElement,
  SidebarDrawerListItemProps
>(({ icon: Icon, selected, href, title, onClick }, ref) => {
  return (
    <ListItemButton
      ref={ref}
      variant="outlined"
      selected={selected}
      component={Link}
      href={href}
      onClick={onClick}
    >
      <ListItemDecorator>
        <Icon sx={{ fontSize: 24 }} />
      </ListItemDecorator>
      <ListItemContent>{title}</ListItemContent>
    </ListItemButton>
  );
});

SidebarDrawerListItem.displayName = "SidebarDrawerListItem";
