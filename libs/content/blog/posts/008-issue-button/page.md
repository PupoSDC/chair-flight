---
  title: Adding an Issue report shortcut
  author: PupoSDC
  date: '2024-01-27'
  tag: Feature
  description: >
    In order to make it easier for you to report issues with Chair Flight, we 
    have added a new button in the top right corner to all our pages. With this 
    button, you can quickly report any issues you find.
---

In order to make it easier for you to report issues with Chair Flight, we
have added a new button in the top right corner to all our pages. With this
button, you can quickly report any issues you find.

This feature is a result of a user suggestion, and we are always listening to
your feedback.

Help us make Chair Flight better!

```tsx eval
<Stack
  sx={{ justifyContent: "space-between", my: 2 }}
  maxWidth="sm"
  margin="auto"
  direction="row"
>
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
  <BugReportButton />
</Stack>
```
