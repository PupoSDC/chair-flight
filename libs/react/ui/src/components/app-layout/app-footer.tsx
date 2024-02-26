import { HTMLAttributes, forwardRef } from "react";
import { twMerge } from 'tailwind-merge'

export const AppFooter = forwardRef<
  HTMLHeadingElement, 
  HTMLAttributes<HTMLHeadingElement>
>(
  (props, ref) => (
    <footer 
      {...props}
      ref={ref} 
      className={twMerge("mb-4 flex items-center", props.className)}  
    >
      <hr className="mt-4 mb-4" />
      <div className="flex-row w-full max-w-lg px-1 md:px-2 justify-start">
        {props.children}
      </div>
    </footer>
  ),
);

AppFooter.displayName = "AppFooter";
