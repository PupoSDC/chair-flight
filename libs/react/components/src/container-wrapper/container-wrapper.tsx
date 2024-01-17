import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { NoSsr } from "@mui/base";
import { Skeleton } from "@mui/joy";
import { Ups } from "../ups";
import type { ComponentType, FunctionComponent, ReactNode } from "react";
import type { FallbackProps } from "react-error-boundary";

export type ContainerWrapperProps = {
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
  ErrorFallbackComponent?: ComponentType<FallbackProps>;
  /**
   * Loading Fallback component. Defers to a big rectangle
   */
  LoadingFallbackComponent?: ComponentType;

  children: ReactNode;
};

const DefaultLoadingComponent: FunctionComponent = () => (
  <Skeleton variant="rectangular" height={300} />
);

const DefaultErrorComponent: FunctionComponent<FallbackProps> = () => (
  <Ups
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
  noSsr,
  deferRendering,
  ErrorFallbackComponent = DefaultErrorComponent,
  LoadingFallbackComponent = DefaultLoadingComponent,
  children,
}) => {
  const ssrChildren = (
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <Suspense fallback={<LoadingFallbackComponent />}>{children}</Suspense>
    </ErrorBoundary>
  );

  if (!noSsr && !deferRendering) return ssrChildren;

  return (
    <NoSsr defer={deferRendering} fallback={<LoadingFallbackComponent />}>
      {ssrChildren}
    </NoSsr>
  );
};
