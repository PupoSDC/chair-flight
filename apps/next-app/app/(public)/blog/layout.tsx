import { BackgroundFadedImage } from "@cf/react/components";
import type { FunctionComponent, ReactNode } from "react";

const BlogLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <BackgroundFadedImage img="article" />
      {children}
    </>
  );
};

export default BlogLayout;
