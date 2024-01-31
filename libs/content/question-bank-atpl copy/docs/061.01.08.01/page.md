---
learningObjectiveId: "061.01.08.01"
parentId: "061.01.08"
title: Average airspeed
---

```tsx
<Question
  id="BADN4IFFD7"
  id="AafsJkc"
  variant="definition"
  lo={["061.01.08.01.01", "061.01.08.01.02"]}
>
  <Text variant="oneCorrect">
    The average wind direction and velocity used for <Subject /> problems is...
  </Text>
  <Option id="AafsJkc-1" subject={[["descent"]]}>
    1/2 of the <Subject /> altitude
  </Option>
  <Option id="AafsJkc-2" subject={[["climb"]]}>
    2/3 of the <Subject /> altitude
  </Option>
  <Option id="AafsJkc-3">
    1/3 of the <Subject /> altitude
  </Option>
  <Option id="AafsJkc-4">
    No such approximation should be used as it would be too inacurate
  </Option>

  <Explanation>
    Long story short, there is no 100% correct way of doing this. It' just a
    "rule of thumb" approximation you can use for doing quick arethemetics
    inside a cockpit. These values are just pulled straight from EASA Learning
    Objectives and you should memorize them: * Average TAS used for climb
    problems is calculated at the altitude 2/3 of the cruising altitude. *
    Average TAS used for descent problems is calculated at the altitude 1/2 of
    the descent altitude. This makes some sense as a descent will usually be
    performed at a constant descent rate throughout, making the middle point a
    decent average of the wind speed and direction. During a climb however, you
    can assume a climb rate decrease towards the end of the climb, biassing the
    "average" point towards a higher altitude. As such a higher factor of 2/3 is
    used.
  </Explanation>
</Question>
```
