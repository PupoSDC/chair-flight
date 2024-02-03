---
learningObjectiveId: "062.02.02.02"
parentId: "062.02.02"
title: Presentation and interpretation
---

```tsx
<Question id="ZXHFCH5M12" lo={["062.02.02.02.06"]}>
  <Text variant="oneCorrect">
    Which statement is correct for${subject} towards an NDB in an area with
    constant wind and constant magnetic variation?
  </Text>
  <Option
    id="ikcfibAw6r-1"
    subject={[["homing"]]}
    why="Describes the Homing technique"
  >
    The relative bearing of the NDB should be kept at 0º
  </Option>
  <Option
    id="ikcfibAw6r-2"
    subject={[["tracking"]]}
    why="Describes the Tracking technique"
  >
    The Relative Bearing of the NDB should be equal (in magnitude and sign) to
    the experienced Drift Angle.
  </Option>
  <Option id="ikcfibAw6r-3">
    The Relative Bearing of the NDB should be equal (in magnitude and sign) to
    the applied Wind Correction Angle.
  </Option>
  <Option id="ikcfibAw6r-4">
    The Relative Bearing of the NDB should be equal to the QDM.
  </Option>

  <Explanation>
    Keep in mind this question is not necessarily asking what is the best way to
    get navigate towards the NDB rather, it wants to test if you know the 2
    established procedures **Homing** and **Tracking**. A good way to learn the
    difference between the 2 is learning about Homing and Tracking missiles (the
    type fighter jets use). A homing missile is a simple design it basically
    keeps the missile target on "center", making no effort to compensate for
    wind, the target movement or anything else. This is extremely inefficient
    and will cause the missile to follow a non-optimal path. A tracking missile
    is a bit smarter than that: It continuously calculates the target position
    and it's position and where the 2 will meet, so that any given time a
    missile is flying the optimal path to its target. Dropping out of Top Gun: *
    When **homing** you keep the ADF marking 0º. The goal here is to get to the
    target for sure, regardless of the convoluted path you take there. * When
    **tracking** you take into account the wind and correct for that by applying
    a Correction equal to the drift angle. This relies on you having access to
    precise drift angle information.
  </Explanation>
</Question>
```
