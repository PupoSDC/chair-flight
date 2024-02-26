"use client";
import { HTMLAttributes, forwardRef } from "react";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '../tooltip';
import { cn } from '../../utils/cn';

export const AppThemeButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <button
    {...props}
    ref={ref}
    className={cn(
      "btn-icon",
      "[&_.tooltip]:right-0", "[&_.tooltip]:width-5",
      props.className
    )}
    onClick={() => {
      const isDarkTheme = localStorage["cf-theme"] === "dark";
      localStorage["cf-theme"] = isDarkTheme ? "light" : "dark";
      if (isDarkTheme){
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }}
  >
    <Tooltip message="Switch to Dark Mode" className='dark:hidden'>
      <MoonIcon className="w-5 h-5" />
    </Tooltip>
    <Tooltip message="Switch to Light Mode" className='hidden dark:block'>
      <SunIcon className="w-5 h-5" />
    </Tooltip>
  </button>
));
