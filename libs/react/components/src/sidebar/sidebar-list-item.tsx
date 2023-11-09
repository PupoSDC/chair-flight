import { forwardRef } from "react";
import {
  Link,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import type { default as SearchIcon } from "@mui/icons-material/Search";

export type SidebarListItemProps = {
  icon: typeof SearchIcon;
  href: string;
  title: string;
  selected?: boolean;
  onClick?: () => void;
};

export const SidebarListItem = forwardRef<
  HTMLAnchorElement,
  SidebarListItemProps
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
        <Icon sx={{ fontSize: 20 }} />
      </ListItemDecorator>
      <ListItemContent>{title}</ListItemContent>
    </ListItemButton>
  );
});

SidebarListItem.displayName = "SidebarListItem";
