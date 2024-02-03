---
learningObjectiveId: "022.03.03"
parentId: "022.03"
title: Direct-reading magnetic compass
---

```tsx
<Question id="S62T6YB1FB" lo={["022.03.03.01.04"]}>
  <Text variant="oneCorrect">
    Your aircraft is lined up Runway 25, which is aligned with a magnetic
    bearing of 253º. You notice that the direct reading magnetic compass reads
    <Subject />. What should you do?
  </Text>
  <Option
    subject={[["264ºM"]]}
    why="The maximum tolerable error for a direct reading magnetic compass is 10º"
  >
    Cancel the flight and return to maintenance
  </Option>
  <Option
    subject={[["262ºM"]]}
    why="The maximum tolerable error for a direct reading magnetic compass is 10º"
  >
    Continue the flight normally.
  </Option>
  <Option why="Magnetic compasses can not be directly adjustable.">
    Manually adjust the compass until it reads a bearing of 253ºM.
  </Option>

  <Option why="If the direct reading compass is indeed INOP, you can not fly.">
    Continue the flight but consider the instrument as INOP
  </Option>
</Question>
```
