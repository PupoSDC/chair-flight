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
} & ListItemButtonProps;

export const SidebarListItem: FunctionComponent<SidebarListItemProps> = ({
  icon: Icon,
  selected,
  href,
  title,
  onClick,
  ...other
}) => {
  return (
    <ListItemButton
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
};
