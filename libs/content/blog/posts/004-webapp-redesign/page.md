---
  title: We refactored our Web App!
  author: PupoSDC
  date: '2023-11-17'
  tag: Technical
  description: >
    In order to keep our focus we decided to restructure our application in three
    different segments. The main ovjective with this refactor is to allow students
    on each of the 3 stages of their aeronautical careers a customized experience
    without being distracted by contents that are not geared towards them.
---

In order to keep our focus we decided to restructure our application in three
different segments. The main ovjective with this refactor is to allow students
on each of the 3 stages of their aeronautical careers a customized experience
without being distracted by contents that are not geared towards them.

<br />

**Enjoy your new home pages:**

```tsx eval
<Stack>
  <ModuleSelectionButton
    fullWidth
    component={"a"}
    sx={{ my: { xs: 1, md: 2 }, maxWidth: 560, mx: "auto" }}
    color={"blue"}
    title={"ATPL theory"}
    description={[
      "Explore questions, learning objectives, and theory reviews ",
      "from the EASA QB ATPL exams.",
    ].join("")}
    icon={<AirplaneTicketIcon />}
    href="/modules/atpl"
  />
  <ModuleSelectionButton
    fullWidth
    component={"a"}
    sx={{ my: { xs: 1, md: 2 }, maxWidth: 560, mx: "auto" }}
    color={"teal"}
    title={"Interview Prep"}
    description={[
      "Use our flash cards to practice answering open ended ",
      "questions and secure your first job.",
    ].join("")}
    icon={<StyleIcon />}
    href="/modules/prep"
  />
  <ModuleSelectionButton
    fullWidth
    component={"a"}
    sx={{ my: { xs: 1, md: 2 }, maxWidth: 560, mx: "auto" }}
    color={"rose"}
    title={"737 Type rating"}
    description={[
      `Prepare or review your theory knowledge for a type rating `,
      `on the Boeing 737.`,
    ].join("")}
    icon={<FlightTakeoffIcon />}
    href="/modules/737"
  />
</Stack>
```
