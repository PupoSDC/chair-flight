import { cntl } from "@cf/base/utils";
import { AppFooter, AppHeader, AppLogo, AppThemeButton } from "@cf/react/ui";
import type { FunctionComponent, ReactNode } from "react";

const BlogLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <AppHeader
        className={cntl`
          backdrop-blur 

          bg-opacity-5 
          bg-zinc-50

          dark:bg-opacity-0
          dark:bg-zinc-700
        `}
      >
        <AppLogo />
        <AppThemeButton />
      </AppHeader>
      
      {children}

      <AppFooter>

      </AppFooter>

    </>
  );
};

export default BlogLayout;
