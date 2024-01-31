---
learningObjectiveId: "021.09.04.04"
parentId: "021.09.04"
title:
  "Electrical load management and monitoring systems: automatic generators and
  bus switching during normal and failure operation, indications and warnings"
---

```tsx
<Question id="8JI7TJL7FH" lo={["021.09.04.04.01"]} oldQuestion>
  <Text variant="multipleCorrect" select={4}>
    In regards to the Generator Control Unit, it can be said that...
  </Text>
  <Option correct>
    Modern GCUs are provided with a permanent indication to record failures.
  </Option>
  <Option
    correct
    why="Dog Clutch release === disconnecting the CSD. This operation can only be performed manually by the pilot."
  >
    All the commands originating form the Control panel are applied via the GCU
    except the dog clutch release.
  </Option>
  <Option>The GCU controls the AC generator voltage.</Option>
  <Option>
    The APU provied the excitation of the AC generator as soon as the APU starts
    up.
  </Option>

  <Explanation>
    A **Generator Control Unit** monitors the generator output parameters. If a
    failure state is detected, the only operation the GCU is able to perform is
    to disconnect the **Generator / Exciter / Field Controller Relay**, causing
    the generator output to fall to 0.
  </Explanation>
</Question>
```
