---
learningObjectiveId: "062.07.05.05"
parentId: "062.07.05"
title: Required navigation performance approach (RNP APCH)
---

```tsx
<Question id="IKKA1J0SXJ" lo={["062.07.05.05.08", "62.07.05.05.07"]}>
  <Text variant="oneCorrect">
    Which of the following is considered aPBN 3D approach?
  </Text>
  <Text variant="multipleCorrect" select={5}>
    Which of the following are considered PBN 3D approaches?
  </Text>
  <Option
    correct
    why="GNSS provides horizontal guidance, and (baro-)VNAV vertical guidance = 3D."
  >
    GNSS + VNAV
  </Option>
  <Option
    correct
    why="SBAS approach procedures with vertical guidance are a 3D PBN approach."
  >
    SBAS
  </Option>
  <Option
    correct
    why="an RNP APCH to localiser performance with vertical guidance is a 3D PBN approach"
  >
    RNP APCH + LPV
  </Option>
  <Option subject={[[]]}>RNP APCH to LNAV/VNAV minima</Option>
  <Option why="Precision Approach Radar uses Radar not PBN.">PAR</Option>
  <Option why="IL2 is a precision approach not a PBN approach.">ILS</Option>
  <Option why="RNP 1 is used for Departure, Arrival and missed approach segments. It's not used for approaches.">
    RNP 1
  </Option>

  <Option why="GLS = GBAS Landing System, relies on a ground based station and therefore is not considered a PBN approach.">
    GLS
  </Option>
</Question>
```
