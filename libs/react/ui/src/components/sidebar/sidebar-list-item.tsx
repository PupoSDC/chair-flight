import { forwardRef } from "react";
import {
  Link,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import type { ListItemButtonProps } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import type { FunctionComponent } from "react";

export type SidebarListItemProps = {
  icon: FunctionComponent<{ sx: SxProps }>;
  href: string;
  title: string;
  selected?: boolean;
  bottom?: boolean;
  onClick?: () => void;
} & Omit<ListItemButtonProps, "children">;

export const SidebarListItem = forwardRef<
  HTMLAnchorElement,
  SidebarListItemProps
>(({ icon: Icon, selected, href, title, onClick, ...other }, ref) => {
  return (
    <ListItemButton
      ref={ref}
      variant="outlined"
      selected={selected}
      component={Link}
      href={href}
      onClick={onClick}
      {...other}
    >
      <ListItemDecorator>
        <Icon sx={{ fontSize: 20 }} />
      </ListItemDecorator>
      <ListItemContent>{title}</ListItemContent>
    </ListItemButton>
  );
});

SidebarListItem.displayName = "SidebarListItem";
