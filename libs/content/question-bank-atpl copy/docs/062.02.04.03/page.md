---
learningObjectiveId: "062.02.04.03"
parentId: "062.02.04"
title: Coverage and range
---

PPPS = Pulse pairs per second.

Interrogation rates vary from 150 to 5 PPPS. With 150 PPS being used for
Aircraft in search mode and aircraft in tracking mode emitting about 20 PPPS. On
the other hand, a DME station is only to process 2700 PPPS.

If we assume that 95% of the aircraft are in the vicinity of a DME are in
tracking mode, and the remaining 5% are in search mode, we can conclude that the
DME will be saturated at 100 aircraft (`95 x 25 + 5 x 150 = 2650`). Keep in mind
this is not a precise value. If all aircraft are in search mode, the DME is
saturated the DME is saturated at 18 aircraft. If all aircraft are not doing
that many interrogations, one DME can satisfy the needs of hundreds of
interrogators. Regardless, 100 is a good estimate of the capacity of a DME.

If the DME is over capacity, the transponders with the highest power will get
replies. these are not necessarily

```tsx
<Question id="BFTIVCVIHG" lo={["062.02.04.03.01"]}>
  <Text variant="oneCorrect">
    Why can DME stations only send distance information to approximately 100
    aircraft at a time?
  </Text>
  <Option
    correct
    why="This is the hard limit that causes the limit of approximately 100 aircraft"
  >
    A DME ground station is only able to process 2700 PPPS
  </Option>
  <Option why="Not necessarily true, the DME may be able to monitor more or less than 100 aircraft.">
    A DME station can only monitor 100 aircraft at a time.
  </Option>
  <Option why="The correct value for PPPs is 2700">
    A DME ground station is only able to process 100 PPPS
  </Option>
  <Option why="The correct value for PPPs is 2700">
    A DME ground station is only able to process 1200 PPPS
  </Option>

  <Option why="The correct value for PPPs is 2700">
    A DME ground station is only able to process 2000 PPPS
  </Option>
</Question>
```
