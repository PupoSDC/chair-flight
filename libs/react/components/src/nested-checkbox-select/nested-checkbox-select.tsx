import { forwardRef, useMemo, useState } from "react";
import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Sheet,
  Stack,
  Typography,
  checkboxClasses,
  styled,
} from "@mui/joy";
import type { StackProps } from "@mui/joy";

export type NestedCheckboxItem = {
  id: string;
  label: string;
  subLabel: string;
  children: Array<{
    id: string;
    label: string;
    subLabel: string;
  }>;
};

const ChapterControlButton = styled(Button)<{ open: boolean }>`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: ${({ theme }) => theme.spacing(0.5)};
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

  ${({ theme }) => theme.breakpoints.up("sm")} {
    padding: ${({ theme }) => theme.spacing(1)};
  }
`;

export type NestedCheckboxSelectProps = {
  items?: NestedCheckboxItem[];
  values?: string[];
  onChange?: (values: string[]) => void;
} & Pick<StackProps, "sx" | "style" | "className">;

export const NestedCheckboxSelect = forwardRef<
  HTMLDivElement,
  NestedCheckboxSelectProps
>(({ items = [], values = [], onChange, ...props }, ref) => {
  const [openChapter, setOpenChapter] = useState<string>();

  const valueMap = useMemo(
    () =>
      values.reduce(
        (s, v) => {
          s[v] = true;
          return s;
        },
        {} as Record<string, boolean>,
      ),
    [values],
  );

  return (
    <Stack {...props} ref={ref} sx={props.sx} role="group">
      {items?.map((parent) => {
        const parentChecked = valueMap[parent.id] ?? false;
        const open = openChapter === parent.id;
        const indeterminate = parent.children.some(
          (child, _, array) => !!valueMap[child.id] !== !!valueMap[array[0].id],
        );

        return (
          <Sheet sx={{ my: 0.5 }} key={parent.id}>
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
                id={parent.id}
                label={
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    justifyContent={"space-between"}
                    alignItems={{ sm: "center" }}
                  >
                    <Typography
                      level="body-md"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "14px", sm: "initial" },
                      }}
                    >
                      {parent.label}
                    </Typography>
                    <Typography level="body-xs">{parent.subLabel}</Typography>
                  </Stack>
                }
                indeterminate={indeterminate}
                checked={parentChecked}
                className={checkboxClasses.focusVisible}
                onChange={() => {
                  const newValues = { ...valueMap };
                  newValues[parent.id] = !parentChecked;
                  parent.children.forEach((c) => {
                    newValues[c.id] = false;
                  });
                  onChange?.(valuesMapToArray(newValues));
                }}
                sx={{
                  p: 1,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              />

              <ChapterControlButton
                variant="plain"
                children={<ChevronRight />}
                open={open}
                disabled={parent.children.length === 0}
                onClick={() =>
                  setOpenChapter((old) =>
                    old === parent.id ? undefined : parent.id,
                  )
                }
              />
            </Box>
            {open && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {parent.children.map((child) => {
                  const childChecked = valueMap[child.id] ?? parentChecked;

                  return (
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
                        label={
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent={"space-between"}
                          >
                            <Typography
                              level="body-md"
                              sx={{
                                fontWeight: 600,
                                fontSize: { xs: "14px", sm: "initial" },
                              }}
                            >
                              {child.label}
                            </Typography>
                            <Typography level="body-xs">
                              {child.subLabel}
                            </Typography>
                          </Stack>
                        }
                        checked={childChecked}
                        sx={{ p: 1, flex: 1, pl: 4 }}
                        onChange={() => {
                          const newValues = { ...valueMap };

                          if (parentChecked) {
                            newValues[parent.id] = false;
                            parent.children.forEach((c) => {
                              newValues[c.id] = true;
                            });
                          }

                          newValues[child.id] = !childChecked;
                          const allChecked = parent.children.every(
                            (c) => !!newValues[c.id],
                          );

                          if (allChecked) {
                            newValues[parent.id] = true;
                            parent.children.forEach((c) => {
                              newValues[c.id] = false;
                            });
                          }
                          onChange?.(valuesMapToArray(newValues));
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Sheet>
        );
      })}
    </Stack>
  );
});

NestedCheckboxSelect.displayName = "NestedCheckboxSelect";

const valuesMapToArray = (record: Record<string, boolean>) =>
  Object.entries(record)
    .filter(([, v]) => v)
    .map(([k]) => k);
