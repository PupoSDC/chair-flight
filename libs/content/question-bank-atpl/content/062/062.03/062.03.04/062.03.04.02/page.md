---
id: "062.03.04.02"
parent: "062.03.04"
questionBank: "atpl"
title: Modes and codes
---

```tsx
<Question id="1IHIHNNVJX" lo={["062.03.04.02.03"]}>
  <Text variant="oneCorrect">
    Which of these statements is correct in regards to SSR?
  </Text>
  <Text variant="oneTwo">
    Which of these statements are correct in regards to SSR?
  </Text>
  <Option correct>The frequency of SSR ground transmissions is 1030 MHz</Option>
  <Option correct>The frequency of ground interrogations is 1030 MHz</Option>
  <Option correct>
    The frequency of transponder transmissions is 1090 MHz
  </Option>
  <Option correct>
    The frequency of responses from the aircraft is 1090 MHz
  </Option>
  <Option correct>The transponder is on the aircraft</Option>
  <Option correct>The interrogator is on the ground</Option>
  <Option correct>
    The frequency of responses and interrogations from SSR transponders are
    distinct.
  </Option>
  <Option correct>
    The frequency of responses and interrogations from SSR are standard
    frequencies separated by 60 MHz
  </Option>
  <Option>The frequency of SSR ground transmissions is 1090 MHz</Option>
  <Option>The frequency of ground interrogations is 1090 MHz</Option>
  <Option>The frequency of transponder transmissions is 1030 MHz</Option>
  <Option>The frequency of responses from the aircraft is 1030 MHz</Option>
  <Option>The transponder is on the ground</Option>
  <Option>The interrogator is on the aircraft</Option>
  <Option>
    The frequency of responses and interrogations from SSR transponders are the
    same.
  </Option>
  <Option>
    The frequency of responses and interrogations from SSR transponders are
    variable frequencies.
  </Option>
  <Option>
    The frequency of responses and interrogations from SSR are standard
    frequencies separated by 63 MHz
  </Option>

  <Option>
    The frequency of responses and interrogations from SSR are standard
    frequencies separated by 100 MHz
  </Option>
</Question>
```

```tsx
<Question id="V8ABVTFN3O" lo={["062.03.04.02.05"]}>
  <Text variant="oneCorrect">
    What is the maximum number of usable SSR transponder codes in Mode A?
  </Text>
  <Option
    correct
    why="Each transponder digit can be a number between 0 and 7. 8 * 8 * 8 * 8 = 4096"
  >
    4096
  </Option>

  <Option>3600</Option>
  <Option>9999</Option>
  <Option>10000</Option>
  <Option>1000</Option>
  <Option>6561</Option>
</Question>
```

```tsx
<Question id="V8ABVTFN3P" lo={["062.03.04.02.07"]}>
  <Text variant="oneCorrect">
    The operation of the transponder ident button...
  </Text>
  <Text variant="oneCorrect">
    The operation of the transponder SPI button...
  </Text>
  <Text variant="oneCorrect">
    The operation of the transponder Special Position Identification button...
  </Text>
  <Option subject={[[]]}>
    Sends a special pulse after the normal pulse train
  </Option>
  <Option subject={[[]]}>
    Sends a special pulse from the aircraft transponder to the ground station
  </Option>
  <Option why="The special pulse is sent before the normal pulse train">
    Sends a special pulse before the normal pulse train
  </Option>
  <Option why="This is a functionality of the normal transponder operation in mode C/S, not a particularity of the SPI mode.">
    Transmits the aeroplanes registration or flight number as a data coded
    sequence
  </Option>

  <Option why="The ident button is available at the transponder in the aircraft.">
    Sends a special pulse from the ground station
  </Option>
</Question>
```

```tsx
<Question id="J1N8OBFLFH" lo={["062.03.04.02.13", "062.03.04.02.06"]}>
  <Text variant="oneCorrect">
    Mode${subject} transponders, the pressure altitude is reported in \_\_\_
    altitude increment
  </Text>
  <Option subject={[["S"]]} why="True for Mode S">
    25 ft
  </Option>
  <Option subject={[["C"]]} why="True for Mode C">
    100 ft
  </Option>

  <Option>10 ft</Option>
  <Option>30 ft</Option>
  <Option>50 ft</Option>
  <Option>1000 ft</Option>
</Question>
```
