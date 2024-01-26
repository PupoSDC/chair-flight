---
learningObjectiveId: "022.02.01.02"
parentId: "022.02.01"
title: "Pitot/static system: design and errors"
---

```tsx eval
<LearningObjectives learningObjectiveId={"022.02.01.02"} />
```

## Summary

```tsx
<Question id="LO9IT60XU9" lo={["022.02.01.02.02"]}>
  <Text variant="oneCorrect">
    If the <Subject /> the instrument will:
  </Text>
<Option>gradually indicate zero</Option>
<Option>
  indicate a height equivalent to the setting on the millibar subscale
</Option>
<Option
  subject={[
    [
      "static source to an airspeed indicator (ASI) becomes blocked during a climb",
    ],
  ]}
>
  under-read
</Option>
<Option
  subject={[
    [
      "static source to an airspeed indicator (ASI) becomes blocked during a descent",
    ],
  ]}
>
  over-read
</Option>
<Option
  subject={[
    ["static source of an altimeter becomes blocked during a descent"],
    ["static source of an altimeter becomes blocked during a climb"],
  ]}
>
  continue to display the reading at which the blockage occurred
</Option>

  <Explanation>
    The altimeter's only input source is static pressure.
    If this becomes blocked, the instrument will simply 'freeze',
    indicating the altitude at which the blockage occurred.

    The Airspeed indicator has 2 inputs: The pitot tube and the static port.
    Velocity is computed from the difference between the total pressure and the
    static pressure. The higher the difference, the higher the speed.

    When the static port becomes blocked, the base value for this comparison
    stagnates.

    In case of a climb, the outside air pressure will be decreasing, while our
    instrument will be measuring a value that is higher than the real value. The
    total pressure pressure will also be decreasing, meaning that our instrument
    will begin to under read the velocity.

    The opposite is true during a descent where the static port will be
    under-reading the static pressure, but the dynamic pressure will keep
    increasing, leading to an over-read of the velocity.

  </Explanation>
</Question>
```

```tsx
<Question id="5REZVKTC16" lo={[""]}>
  <Text variant="oneCorrect">
    The error in altimeter readings caused by the variation of the static
    pressure near the source is known as:
  </Text>

  <Option>barometric error.</Option>
  <Option correct>position pressure error</Option>
  <Option>hysteresis effect.</Option>
  <Option>instrument error.</Option>
</Question>
```

```tsx
<Question id="T0PKBXH2IO" lo={[""]}>
  <Text variant="oneCorrect">
    When flying in <Subject />, the altimeter will:
  </Text>
<Option subject={[["warm air (warm than standard atmosphere)"]]}>
  underestimate
</Option>
<Option>be just as correct as before</Option>
<Option subject={[["cold air (colder than standard atmosphere)"]]}>
  overestimate
</Option>
<Option>show the actual height above ground</Option>

  <Explanation>
    > From High to low, beware below! From Hot to cold, don't be bold!
  </Explanation>
</Question>
```
