---
learningObjectiveId: "061.04.01.02"
parentId: "061.04.01"
title: Convergence
---

```tsx eval
<LearningObjectives learningObjectiveId={"061.04.01.02"} />
```

## Summary

### Chart vs Earth convergence

Earth meridian convergence is the difference in inclination between two
meridians on the earth or the change in true track (direction) of a **great
circle** between two meridians on the earth.

Chart meridian convergence is the difference in inclination between two
meridians on a chart or the change in true track (direction) of a **straight
line** between two meridians on a chart.

```tsx
<Question id="ES4GXW5SAZ" lo={["061.04.01.02.02"]} contentRef="### Chart vs Earth convergence">
  <Text variant="oneCorrect">
    A <Subject /> is drawn between two points on a chart. The change in true
    track is 20º.
  </Text>
<Option subject={[["straight line"]]}>Chart meridian convergence is 20º</Option>
<Option subject={[["great circle"]]}>Earth meridian convergence is 20º</Option>
<Option why="This option never makes sense. If the change in true track is 20º, the convergence is 20º.">
  Chart meridian convergence is 10º
</Option>

  <Option why="This option never makes sense. If the change in true track is 20º, the convergence is 20º.">
    Earth meridian convergence is 10º
  </Option>
</Question>
```
