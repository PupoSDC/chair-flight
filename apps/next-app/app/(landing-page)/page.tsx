import { cntl } from '@cf/base/utils';
import { AppHeader, AppFooter, AppLogo, AppThemeButton, Typical, cn, AirplanesAnimation } from '@cf/react/ui'
import App from 'next/app';
import { FunctionComponent } from 'react'


const LandingPage: FunctionComponent = async () => {

  return (
    <>
      <AppHeader>
        <AppLogo />
        <AppThemeButton />
      </AppHeader>
      <main>
        <AirplanesAnimation
          className={cn(
            'absolute',
            'w-full',
            'h-[calc(100vh_-_var(--header-height))]',
            '-z-10',
            'pointer-events-none',
            'opacity-60'
          )}
        />
        <div
          className={cn(
            'text-center py-16',
            'flex flex-col items-center',
            'min-h-[calc(100vh_-_var(--header-height))]',
            'dark:text-neutral-50',
          )}
        >
          <h1 className='text-4xl'>
            Chair Flight is<br />
            <Typical
              className='text-primary-400'
              steps={[
                "Community Built",
                2000,
                "Minimalistic",
                2000,
                "Free",
                2000,
              ]}
            />
          </h1>
          <div className='text-md font-semibold'>
            Built by students for students.
          </div>

          <button className='mt-auto bg-primary-400'>
            Get Started
          </button>
        </div>
      </main>
      <AppFooter>

      </AppFooter>
    </>
  );
}

export default LandingPage
