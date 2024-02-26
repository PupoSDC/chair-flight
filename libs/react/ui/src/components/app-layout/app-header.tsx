import { twMerge } from 'tailwind-merge'
import { cntl } from '@cf/base/utils'
import { HTMLAttributes, forwardRef } from 'react'

export const AppHeader = forwardRef<
  HTMLHeadingElement, 
  HTMLAttributes<HTMLHeadingElement>
>(
  (props, ref) => (
    <>
      <header
        {...props}
        ref={ref}
        className={twMerge(cntl`
          fixed
          flex
          flex-row 
          items-center
          justify-between
          text-primary 
          w-full 
          h-header
          px-2 md:px-4 
          py-0 
          border-b
          border-neutral-200 dark:border-neutral-700
          z-40
        `, props.className)}
      >
        {props.children}
      </header>
      <div className="h-10 w-full"></div>
    </>
  ),
)

AppHeader.displayName = "AppHeader";