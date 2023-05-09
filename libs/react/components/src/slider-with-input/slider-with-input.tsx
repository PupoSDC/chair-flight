import { forwardRef } from "react";
import { Input, Sheet, Slider, sliderClasses, inputClasses } from "@mui/joy";
import type { SliderProps } from "@mui/base";
import type { SheetProps } from "@mui/joy";

export type SliderWithInputProps = {
  value?: number;
  onChange?: (value: number) => void;
} & Pick<SliderProps, "max" | "min" | "step" | "className"> &
  Pick<SheetProps, "sx">;

/**
 * A combo of an input and a slider. The ref is passed to the input element for
 * better integration with react hooks, the style props are passed to the root
 * sheet component. Everything else is passed to the slider.
 */
export const SliderWithInput = forwardRef<
  HTMLInputElement,
  SliderWithInputProps
>(({ value, sx, onChange, max = 100, min = 0, className, ...props }, ref) => (
  <Sheet
    className={className}
    sx={{
      display: "flex",
      [`& .${inputClasses.root}`]: {
        borderRight: "1px solid",
        borderRightColor: (t) => t.vars.palette.neutral.outlinedBorder,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      [`& .${sliderClasses.root}`]: {
        mx: 2,
        my: 0.5,
      },
      ...sx,
    }}
  >
    <Input
      type="number"
      value={value}
      ref={ref}
      variant="plain"
      onChange={(e) =>
        onChange?.(Math.min(Math.max(Number(e.target.value), min), max))
      }
      sx={{
        maxWidth: "4em",
        textAlign: "right",
        "& input[type=number]": {
          "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
      }}
    />
    <Slider
      {...props}
      tabIndex={-1}
      max={max}
      min={min}
      onChange={(_, value) => onChange?.(value as number)}
      value={value}
    />
  </Sheet>
));
