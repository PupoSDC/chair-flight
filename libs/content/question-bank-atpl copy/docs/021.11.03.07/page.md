---
learningObjectiveId: "021.11.03.07"
parentId: "021.11.03"
title: Reverse thrust
---

### Trust reverser controls and indications

The thrust reverser is operated with a lever that is embedded in the main
throttle quadrant:

![Thrust reverser lever](images/021.11.03.07-01.jpeg)

The **stowed** position is the default position. In this position the thrust
reveres are stowed away, i.e.: they are not deployed. To operate the controls
the throttle must be in idle to allow the lever to be moved. The lever can then
be pulled up to the desired thrust reverser intensity.

A reverse thrust alert light is provided that turns on under abnormal situations
such as:

- The **reverse doors are unlocked** with the **reverser lever in the stowed**
  position.
- The **reverser doors remain stowed** with the **reverser lever in the
  deployed** position.

```tsx
<Question
  id="8KU9V11YTC"
  lo={["021.11.03.07.07"]}
  contentRef="### Trust reverser controls and indications"
>
  <Text variant="oneCorrect">
    Under which of these circumstances should you expect a reverse thrust alert
    on the flight deck?
  </Text>
  <Text variant="oneTwo">
    Under which of these circumstances should you expect a reverse thrust alert
    on the flight deck?
  </Text>
  <Text variant="multipleCorrect" select={4}>
    Under which of these circumstances should you expect a reverse thrust alert
    on the flight deck?
  </Text>
  <Option
    correct
    why="This is an abnormal situation. The doors should be locked in the stowed position."
  >
    The reverse doors are unlocked with the reverser lever in the stowed
    position.
  </Option>
  <Option
    correct
    why="This is an abnormal situation. The doors should be open in the deployed position."
  >
    The reverser doors remain stowed with the reverser lever in the deployed
    position.
  </Option>
  <Option why="This is a normal situation. The throttle lever setting corresponds to the current state of the system. No warning light required.">
    The reverser doors remain stowed with the lever in the stowed position.
  </Option>
  <Option why="This is a normal situation. The throttle lever setting corresponds to the current state of the system. No warning light required.">
    The reverser doors are unlocked with the reverser lever in the deployed
    position.
  </Option>

  <Option why="At full throttle the reverser doors should definitely be closed. So all is good.  No warning light required.">
    The reverser doors remain stowed with full throttle.
  </Option>
</Question>
```
