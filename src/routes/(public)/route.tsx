import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { ButtonIconLink } from "../../libs/ui/components/base/button-icon-link";
import { ThemeToggle } from "../../libs/ui/components/base/theme-toggle";
import { Wordmark } from "../../libs/ui/components/base/wordmark";
import { AccountButton } from "../../libs/ui/components/community/account-button";
import { ChevronRightIcon } from "../../libs/ui/icons/chevron-right-icon";
import { GithubIcon } from "../../libs/ui/icons/github-icon";
import { PropellerFront } from "../../libs/ui/outlines/propeller-front";
import { TurbofanFront } from "../../libs/ui/outlines/turbofan-front";
import { WingPlan } from "../../libs/ui/outlines/wing-plan";
import { YokeFront } from "../../libs/ui/outlines/yoke-front";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const PublicBlueprintBackground: FC = () => {
  return (
    <div aria-hidden="true" className="home-blueprint-background">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 960"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        className="size-full"
      >
        <g opacity="0.35" strokeWidth="0.7">
          {Array.from({ length: 37 }, (_, index) => (
            <path key={`v${index}`} d={`M${index * 40} 0v960`} />
          ))}
          {Array.from({ length: 25 }, (_, index) => (
            <path key={`h${index}`} d={`M0 ${index * 40}h1440`} />
          ))}
        </g>
        <g className="home-blueprint-turbine" transform="translate(175 210)">
          <TurbofanFront x={-300} y={-300} width={600} height={600} />
        </g>
        <g
          className="home-blueprint-propeller"
          transform="translate(1190 185) rotate(28)"
        >
          <PropellerFront x={-265} y={-265} width={530} height={530} />
        </g>
        <g
          className="home-blueprint-wing"
          transform="translate(60 740) rotate(-18)"
        >
          <WingPlan x={-30} y={-240} width={606} height={430} />
        </g>
        <g
          className="home-blueprint-yoke"
          transform="translate(1170 745) rotate(-12)"
        >
          <YokeFront x={-245} y={-245} width={490} height={490} />
        </g>
        <g opacity="0.55" strokeWidth="0.8">
          <path
            d="M490 0v235h260M950 960V730H720M0 580h260M1440 495h-245"
            strokeDasharray="8 7"
          />
          <circle cx="490" cy="235" r="5" />
          <circle cx="950" cy="730" r="5" />
          <path d="M695 110h50m-25-25v50M695 850h50m-25-25v50" />
          <path d="M530 150Q720 45 915 150M540 800Q720 910 900 800" />
        </g>
      </svg>
    </div>
  );
};

const PublicLayout: FC = () => {
  const postMatch = useMatches().find(
    (match) => match.routeId === "/(public)/blog/$postId",
  );
  const postTitle = (postMatch?.loaderData as { title?: string } | undefined)
    ?.title;

  return (
    <div className="home-page relative isolate flex h-dvh flex-col overflow-hidden text-ink">
      <PublicBlueprintBackground />
      <header
        className={cn(
          "relative z-20 flex h-12 flex-none items-center gap-6 border-b",
          "border-rule bg-paper/80 pr-4 pl-2 backdrop-blur",
        )}
      >
        <Wordmark logoOnly={Boolean(postTitle)} />
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-sm"
        >
          <Link
            to="/blog"
            className="text-muted no-underline hover:text-accent"
          >
            Blog
          </Link>
          {postTitle && (
            <>
              <ChevronRightIcon size={14} className="flex-none text-muted" />
              <span className="truncate text-ink">{postTitle}</span>
            </>
          )}
        </nav>
        <span className="flex-1" />
        <div className="flex items-center gap-1">
          <ButtonIconLink
            to="."
            href="https://github.com/PupoSDC/chair-flight"
            target="_blank"
            rel="noreferrer"
            icon={GithubIcon}
            label="GitHub"
          />
          <ThemeToggle />
          <AccountButton variant="header" />
        </div>
      </header>
      <div
        data-scroll-reset
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          "overscroll-contain",
        )}
      >
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
        <footer className="flex flex-none justify-center gap-5 px-4 py-4 text-xs">
          <Link
            to="/about"
            className="text-accent no-underline hover:underline"
          >
            About
          </Link>
          <Link
            to="/terms"
            className="text-accent no-underline hover:underline"
          >
            Terms of service
          </Link>
          <Link
            to="/privacy"
            className="text-accent no-underline hover:underline"
          >
            Privacy
          </Link>
        </footer>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(public)")({
  component: PublicLayout,
});
