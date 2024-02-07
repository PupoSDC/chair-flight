import { Button, ButtonProps } from "@mui/joy";
import { forwardRef, useCallback, useState } from "react";

export const LoadingButton = forwardRef<
    HTMLButtonElement,
    Omit<ButtonProps, "loading">
>((props, ref) => {
    const [loading, setLoading] = useState(false);

    const onClick = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            setLoading(true);
            try {
                await props.onClick?.(event);
            } finally {
                setLoading(false);
            }
        },
        [props.onClick]
    );

    return (
        <Button 
            ref={ref} 
            {...props} 
            loading={loading}
            onClick={onClick}
         />
    )
});