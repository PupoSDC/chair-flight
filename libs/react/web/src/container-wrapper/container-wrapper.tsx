import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { NoSsr } from "@mui/base";
import { Skeleton } from "@mui/joy";
import { Ups } from "../ups";
import type { SxProps } from "@mui/joy/styles/types";
import type { ComponentType, FunctionComponent, ReactNode } from "react";
import type { FallbackProps } from "react-error-boundary";

export type ErrorFallbackProps = FallbackProps & { sx?: SxProps };
export type LoadingFallbackProps = { sx?: SxProps };

export type ContainerWrapperProps = {
  /**
   * Forwarded to error fallback and error fallback.
   */
  sx?: SxProps;

  /**
   * Skips rendering on server.
   */
  noSsr?: boolean;
  /**
   * Defers rendering on client.
   * If `true`, then `noSsr` is also enabled!
   */
  deferRendering?: boolean;
  /**
   * Error Fallback component. Defers to `Ups` component
   */
  ErrorFallbackComponent?: ComponentType<ErrorFallbackProps>;
  /**
   * Loading Fallback component. Defers to a big rectangle
   */
  LoadingFallbackComponent?: ComponentType<LoadingFallbackProps>;

  children: ReactNode;
};

const DefaultLoadingComponent: FunctionComponent<LoadingFallbackProps> = ({
  sx,
}) => <Skeleton variant="rectangular" height={300} sx={sx} />;

const DefaultErrorComponent: FunctionComponent<ErrorFallbackProps> = ({
  sx,
}) => (
  <Ups
    sx={sx}
    color="danger"
    message="An Unexpected Error Has happened!"
    children="Please try refreshing the page"
  />
);

/**
 * Utility component that should wrap (almost) all containers. This provides a
 * baseline of what is expected from a container: It should be a self contained
 * part of the application capable of self handling errors and suspense events.
 */
export const ContainerWrapper: FunctionComponent<ContainerWrapperProps> = ({
  sx,
  noSsr,
  deferRendering,
  ErrorFallbackComponent = DefaultErrorComponent,
  LoadingFallbackComponent = DefaultLoadingComponent,
  children,
}) => {
  const ssrChildren = (
    <ErrorBoundary
      fallbackRender={(props) => <ErrorFallbackComponent {...props} sx={sx} />}
    >
      <Suspense fallback={<LoadingFallbackComponent sx={sx} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );

  if (!noSsr && !deferRendering) return ssrChildren;

  return (
    <NoSsr
      defer={deferRendering}
      fallback={<LoadingFallbackComponent sx={sx} />}
    >
      {ssrChildren}
    </NoSsr>
  );
};
