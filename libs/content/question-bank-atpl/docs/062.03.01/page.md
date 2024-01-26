---
learningObjectiveId: "062.03.01"
parentId: "062.03"
title: Pulse techniques
---

```tsx eval
<LearningObjectives learningObjectiveId={"062.03.01"} />
```

## Summary

```tsx
<Question id="G25C74KULS" lo={["062.03.01.01.01"]}>
  <Text variant="oneCorrect">
    Which of the following equipment operates using the${subject}?
  </Text>
<Text variant="multipleCorrect" select={4}>
  Which of the following equipment operate using the${subject}?
</Text>
<Option
  subject={[["Pulse Technique"], ["Echo Principle"]]}
  why="RADAR ==> Pulse Technique. Use the echo principle to detect reflections off aircraft surfaces."
>
  Aerodrome Surface Movement Radar
</Option>
<Option
  subject={[["Pulse Technique"], ["Echo Principle"]]}
  why="RADAR ==> Pulse Technique. Uses the echo principle to detect water / ice droplets"
>
  Airborne Weather Radar
</Option>
<Option
  subject={[["Pulse Technique"], ["Echo Principle"]]}
  why="RADAR ==> Pulse Technique. Use the echo principle to detect reflections off aircraft surfaces."
>
  Aerodrome Surveillance / Approach Radar
</Option>
<Option
  subject={[["Pulse Technique"], ["Interrogator / transponder principle"]]}
  why="RADAR ==> Pulse Technique. SSR uses pulses to transmit information between the ground station and the aircraft"
>
  Secondary Surveillance Radar
</Option>
<Option
  subject={[["Pulse Technique"], ["Interrogator / transponder principle"]]}
  why="DME still uses radar, although not in its name. So it's also using the Pulse Technique. It's also using the interrogator transponder principle to obtain distance between the aircraft and the ground station."
>
  Distance Measure Equipment
</Option>
<Option why="Radio Altimeters use the Continuos Wave technique.">
  Radio altimeter
</Option>
<Option why="A VOR ground station uses a specialized antenna system to transmit both an amplitude modulated and a frequency modulated signal.">
  VOR
</Option>

  <Option>Non Directional Beacons</Option>
</Question>
```

```tsx
<Question id="HNVH63KUL2" lo={["062.03.01.01.03"]}>
  <Text variant="oneCorrect">
    In a primary radar using the pulse technique${subject} determines...
  </Text>
<Option
  subject={[["pulse length"]]}
  why="The pulse technique works by sending a series of pulses and then &#x22;listening&#x22; to the their echoes. While emitting a pulse the receiver is not activate to avoid picking up the emission. As such, the longer the pulse length, the longer the time the receiver needs to be turned off, and the longer the minimum range of the radar."
>
  minimum measure range.
</Option>
<Option subject={[["pulse recurrence frequency"], ["PRF"]]}>
  maximum range of radar
</Option>

  <Option>Beam width</Option>
  <Option>Target discrimination</Option>
</Question>
```
