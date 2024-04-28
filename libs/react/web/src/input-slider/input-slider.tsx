import { useEffect, useState } from "react";
import { Input, Slider, inputClasses, styled } from "@mui/joy";
import type { SliderProps } from "@mui/base";
import type { InputProps } from "@mui/joy";
import type { FunctionComponent } from "react";

const NumberInputWithoutNativeControls = styled(Input)`
  text-align: right;

  & input {
    max-width: 4em;
  }

  & .${inputClasses.endDecorator} {
    flex: 1;
    margin-right: ${({ theme }) => theme.spacing(2)};
  }

  & input[type="number"] {
    -moz-appearance: textfield;
  }
  & input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  & input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export type InputSliderProps = {
  value?: number;
  onChange?: (value: number) => void;
} & Pick<SliderProps, "max" | "min" | "step"> &
  Pick<InputProps, "disabled" | "sx" | "variant" | "className" | "ref">;

/**
 * A combo of an input and a slider. That functions exactly like a normal input.
 * It can be used directly inside `FormControl` and plugged in with
 * `react-hook-form`.
 */
export const InputSlider: FunctionComponent<InputSliderProps> = (
  {
    value,
    sx,
    variant = "outlined",
    max = 100,
    min = 0,
    disabled,
    className,
    onChange,
    ...props
  },
  ref,
) => {
  const [instantValue, setInstantValue] = useState(value);

  useEffect(() => {
    setInstantValue(value);
  }, [value]);

  return (
    <NumberInputWithoutNativeControls
      ref={ref}
      variant={variant}
      type="number"
      sx={sx}
      disabled={disabled}
      className={className}
      value={instantValue}
      onChange={(e) =>
        onChange?.(Math.min(Math.max(Number(e.target.value), min), max))
      }
      endDecorator={
        <Slider
          {...props}
          disabled={disabled}
          tabIndex={-1}
          max={max}
          min={min}
          onChangeCommitted={(_, value) => onChange?.(value as number)}
          onChange={(_, value) => setInstantValue(value as number)}
          value={instantValue}
        />
      }
    />
  );
};
