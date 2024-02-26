import { TrpcProvider } from "@cf/react/trpc";
import { default as Script } from 'next/script'
import "./globals.css";

export const metadata = {
  title: "Chair Flight",
  description: [
    "Chair Flight is a community driven Aviation Question Bank built by ",
    "students for students. Prepare yourself for your ATPL exams, Interviews, ",
    "and type rating technical exams.",
  ].join(" "),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProvider>
      <html lang="en" className="antialiased min-h-screen">
        <head>
          <script dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            `,
            }}
          />
        </head>
        <body className="min-h-screen bg-white dark:bg-black">
          {children}
        </body>
      </html>
    </TrpcProvider>
  );
}
