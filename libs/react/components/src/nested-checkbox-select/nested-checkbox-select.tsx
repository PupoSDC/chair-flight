import { forwardRef, useState } from "react";
import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Sheet,
  Typography,
  checkboxClasses,
  styled,
} from "@mui/joy";
import type { BoxProps } from "@mui/joy";

export type NestedCheckboxItem = {
  id: string;
  checked: boolean;
  label: string;
  subLabel: string;
  children: Array<NestedCheckboxItem & { children: never[] }>;
};

const ChapterControlButton = styled(Button)<{ open: boolean }>`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: ${({ open, theme }) =>
    open ? 0 : theme.radius.sm};
  min-height: 36px;
  border-left: 1px solid;
  border-left-color: ${({ theme }) =>
    theme.vars.palette.neutral.outlinedBorder};
  animation: "";

  & > svg {
    transition-duration: 250ms;
    transform: ${({ open }) => (open ? "rotate(90deg)" : "initial")};
  }

  &:disabled > svg {
    visibility: hidden;
  }
`;

export type NestedCheckboxSelectProps = {
  items?: NestedCheckboxItem[];
  onChange?: (item: NestedCheckboxItem, value: boolean) => void;
} & Pick<BoxProps, "sx" | "style" | "className">;

export const NestedCheckboxSelect = forwardRef<
  HTMLDivElement,
  NestedCheckboxSelectProps
>(({ items, onChange, ...props }, ref) => {
  const [openChapter, setOpenChapter] = useState<string>();
  return (
    <Sheet
      {...props}
      ref={ref}
      sx={{ ...props.sx, display: "flex", flexDirection: "column", p: 1 }}
      role="group"
    >
      {items?.map((item) => {
        const open = openChapter === item.id;
        const indeterminate = ![0, item.children.length].includes(
          item.children.reduce((s, r) => s + Number(r.checked), 0),
        );

        return (
          <Sheet sx={{ my: 0.5 }} key={item.id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                borderBottom: open ? "1px solid" : "initial",
                color: (t) => t.vars.palette.neutral.outlinedBorder,
              }}
            >
              <Checkbox
                overlay
                id={item.id}
                label={item.label}
                indeterminate={indeterminate}
                checked={item.checked}
                className={checkboxClasses.focusVisible}
                onChange={() =>
                  onChange?.(
                    {
                      ...item,
                      checked: !item.checked,
                      children: item.children.map((child) => ({
                        ...child,
                        checked: !item.checked,
                      })),
                    },
                    !item.checked,
                  )
                }
                sx={{
                  p: 1,
                  flex: 1,
                  alignSelf: "center",
                  position: "relative",
                  [checkboxClasses.focusVisible]: {
                    borderRadius: "sm",
                    color: "primary.solidColor",
                  },
                }}
              />
              <Typography level="body-xs" sx={{ px: 2, alignSelf: "center" }}>
                {item.subLabel}
              </Typography>
              <ChapterControlButton
                variant="plain"
                children={<ChevronRight />}
                open={open}
                disabled={item.children.length === 0}
                onClick={() =>
                  setOpenChapter((old) =>
                    old === item.id ? undefined : item.id,
                  )
                }
              />
            </Box>
            {open && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {item.children.map((child) => (
                  <Box
                    key={child.id}
                    sx={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      overlay
                      key={child.id}
                      id={child.id}
                      label={child.label}
                      checked={child.checked}
                      sx={{ p: 1, flex: 1, pl: 4 }}
                      onChange={() => {
                        const children = item.children.map((c) => ({
                          ...c,
                          checked: c.id === child.id ? !c.checked : c.checked,
                        }));
                        const checked = children.every((c) => c.checked);
                        onChange?.(
                          { ...item, children, checked },
                          !child.checked,
                        );
                      }}
                    />
                    <Typography level="body-sm" sx={{ pr: 2 }}>
                      {child.subLabel}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Sheet>
        );
      })}
    </Sheet>
  );
});

NestedCheckboxSelect.displayName = "NestedCheckboxSelect";
