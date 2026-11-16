# Working in chair-flight

This is a briefing for AI Agents. This is the only AGENTS file; keep it current.

One TanStack Start app, deployed as a single Vercel project on `chair-flight.com`:

## Guidelines for writing code

- Use arrow function assignment to variables over function declarations.
- Only use classes for providers.
- For react components, use FC with props define within (in place, preferably)
- Most files have one main export: the function, component or hook the file is named after. Everything else the file needs stays private. The file may also export static auxiliary values or types that exist only to support that main export (e.g. a storage key constant, a props type) but never a second function, component or hook. Exceptions: files that contain only definitions (types, constants), files of repetitive util code, and `toaster.tsx`, whose single export `Toaster` carries its API as static members (`Toaster.toast`, `Toaster.dismiss`).
- Long functions / components are ok. specially if complexity is low.
- Functions should be named imperatively (ie calculateTimeAvailable). Components Declaratively (ie.: TimeAvailable)
- Don't write code documentation nor comments, unless explicitely requested to do so. Use descriptive variable names, specially inside long "cookbook" functions.
- Start Page components should be named "AccountsPage", "DesignSystemPage", etc... In general there should never be 2 functions in the whole cade base with the same name, for searchability.
- use the "cn" function to wrap any style that is not trivial.
- Styles should not go beyond the 80 character ruler. Use `cn` to breakdown styles into multiple lines.
- Obey tailwind good practices. Keep sizes consistent with design system. no size-[34px], if you can do size-8.5.
- Braces follow line count. If it fits on one line (80 chars), no braces: `if (!id) return null;` and `const formatCount = (count: number) => (count ? String(count) : "");`. If it needs two or more lines, use braces: `if` gets `{ }`, and an arrow function gets a block body with an explicit `return`, never a wrapped expression body.
- Avoid creating variables just to assign them later (`const items = []; for (...) items.push(...)`). Build values in one expression with `map`, `filter`, `reduce` or `Array.from`. `let` should be very rare; reach for it only when there is no reasonable expression-based alternative.
- File order: imports, types, constants, helper functions, sub components, then the main export last.
- File names should follow kebab-case convention
- Don't create tiny abstractions that only save a few lines (ie a `createDateFormat` wrapping `new Intl.DateTimeFormat`). Inline the full call at each use. If the reader has to jump up or down the file to understand a value, the abstraction is not worth it. Only extract when the logic is non-trivial or reused in several files.
- Don't export types just so callers can annotate with them. Type props and values in place and rely on duck typing; callers pass plain objects and let inference do the work. Don't create a named type for a shape that is only used once.
- Format functions follow `format[Input]As[Output]` (`formatIsoDateAsShortDate`). They live in `libs/base/format-values.ts`. ShortDate is DD/MM/YY, LongDate is "2 February 1929".
- Inside components, order the body: `useState`, then `useMemo` / `useCallback` (and other derived hooks), then effects, then plain JS (handlers and values).
- It is fine for a UI component to know some business logic. Prefer a `type` prop (`type="wallet"`) over passing column lists and flags from the page. However, components should NOT pull types from DB or core to achieve this!
- React component props that are booleans are named without an `is` prefix (`open`, `collapsed`, `groupedByCategory`), following the HTML convention (`disabled`, `checked`).
- Do not create react components inside of ui/components unless explicitely told to do so.
- Whenever adding a react component to the ui library, a story should be added to design-system unless instructed to do otherwise.
- Modals and dialogs have a fixed size that never changes with their content or loading state. Give the body a fixed height and scroll the overflowing part inside it.
- Object types are always written multi-line, one member per line, even when short.

## Code structure

The code has implicit dependencies.

`libs/base` code should not have any imports either from inside or outside the project.
`libs/core/*` code can reference external packages and base code, but not interact with external providers directly.
`libs/providers/*` provide connection to the outside world. It should not have any business logic.
`libs/ui` should contain UI code that may, sporadically, make use of base and core code.
`libs/ui/components` should contain reusable, self contained, components.

`routes/-server-functions/*` is where data is constructed. Data is aquired using providers, passed on to core functions, and returned. folder structuring should mirror core, and cross polination should no exist (ie, server/functions should not be pulling from core/finances).

## Guidelines for copy

- Use British UK English for spelling.
- Use gender neutral language (they).
- Avoid labels in graphics and visualizations. Have a title, and use subtitles only for critical information. Avoid explainer texts of what things are unless explicitely asked to do so.
