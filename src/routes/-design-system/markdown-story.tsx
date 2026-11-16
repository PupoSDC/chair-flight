import { Markdown } from "../../libs/ui/components/base/markdown";
import type { FC } from "react";

const CONTENT = `## Hydraulic systems

The aircraft has **three** independent systems: *A*, *B* and standby.

- System A: engine 1 pump and an electric pump
- System B: engine 2 pump and an electric pump

| System | Pressure |
| ------ | -------- |
| A      | 3000 psi |
| B      | 3000 psi |

> Check the quantity before the first flight of the day.

See the [FCOM](https://example.com) for \`limitations\`.`;

export const MarkdownStory: FC = () => (
  <div className="max-w-2xl">
    <Markdown>{CONTENT}</Markdown>
  </div>
);
