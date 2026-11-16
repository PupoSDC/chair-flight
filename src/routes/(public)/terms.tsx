import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const CONTENT = `Last updated: 16 November 2026.

Chair Flight is a free and open source project. By using this website you agree to the terms below.

## Use of the service

You may use Chair Flight, free of charge, for personal study and for any other lawful purpose. Please do not attack the service, overload it with automated requests, or try to access anything that is not meant to be public. If you really want the questions, there is no need to scrape our API: download them from [GitHub](https://github.com/PupoSDC/chair-flight).

## Educational purposes only

The questions, explanations and notes are provided to help you study. They may contain mistakes or be out of date. They are not approved training material and must never be used for operational decisions or as a replacement for official documentation, manuals or instruction.

## No warranty

The service is provided "as is" and "as available", without warranties of any kind. We do not guarantee that it will be accurate, uninterrupted or error free, nor that it will help you pass any exam.

## Limitation of liability

To the fullest extent permitted by law, the maintainers and contributors of Chair Flight are not liable for any loss or damage arising from the use of, or the inability to use, the service.

## Licence and contributions

The source code and content are published on [GitHub](https://github.com/PupoSDC/chair-flight) under the [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/). You may read, study, run and modify the project for non-commercial purposes, and you are welcome to contribute.

You may not take the project and host it as your own service, republish it, or add paid features, advertising or any other form of monetisation to it. Any commercial use requires our written permission.

By contributing to the project you agree that your contribution may be distributed under the same licence.

## Trademarks

Airbus, Boeing, EASA and any other names mentioned belong to their respective owners. Chair Flight is not affiliated with, or endorsed by, any of them.

## Changes

We may update these terms from time to time. The date above shows when they last changed. Questions can be sent to [info@chair-flight.com](mailto:info@chair-flight.com).`;

const TermsPage: FC = () => (
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
        Terms of service
      </h1>
      <Markdown className="text-base leading-7">{CONTENT}</Markdown>
    </article>
  </main>
);

export const Route = createFileRoute("/(public)/terms")({
  head: () => ({ meta: [{ title: "Terms of service · Chair Flight" }] }),
  component: TermsPage,
});
