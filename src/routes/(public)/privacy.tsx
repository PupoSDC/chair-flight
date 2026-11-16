import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const CONTENT = `Last updated: 16 November 2026.

Chair Flight is built to collect as little as possible. The short version: **we do not use tracking or advertising cookies, and we do not sell anything**. We do keep some statistical data, such as pages visited and tests created, to improve our service.

## What we do not do

- No tracking or advertising cookies.
- No advertising, and no sharing of data with advertisers.
- No payments, and no fees of any kind.

## What we keep

Aggregate statistics about how the service is used, such as which pages are visited and how many tests are created. We use them only to improve Chair Flight.

## What stays on your device

Your theme preference and the test you are currently taking are stored in your browser, using local storage. This information never leaves your device, and you can remove it at any time by clearing your browser data.

## Hosting

The website is served by a hosting provider, which may process technical information such as your IP address in order to deliver pages and keep the service secure. We do not use this information to identify you.

## Contact

If you have any question about privacy, write to [info@chair-flight.com](mailto:info@chair-flight.com).`;

const PrivacyPage: FC = () => (
  <main
    className={cn(
      "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10",
      "sm:py-16",
    )}
  >
    <article
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-rule bg-paper/85 p-5",
        "backdrop-blur sm:p-10",
      )}
    >
      <h1
        className={cn(
          "m-0 text-3xl leading-tight font-bold tracking-tighter sm:text-4xl",
        )}
      >
        Privacy
      </h1>
      <Markdown className="text-base leading-7">{CONTENT}</Markdown>
    </article>
  </main>
);

export const Route = createFileRoute("/(public)/privacy")({
  head: () => ({ meta: [{ title: "Privacy · Chair Flight" }] }),
  component: PrivacyPage,
});
