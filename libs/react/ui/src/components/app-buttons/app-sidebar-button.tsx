"use client";
import { HTMLAttributes, forwardRef } from "react";
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useSidebar } from '../../hooks/use-sidebar';
import { cn } from '../../utils/cn';

export const AppSidebarButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <button
    {...props}
    ref={ref}
    className={cn("btn-icon", props.className)}
    onClick={useSidebar().openSidebar}
  >
    <Bars3Icon  />
  </button>
));
