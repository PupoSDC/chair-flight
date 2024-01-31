---
learningObjectiveId: "062.02.05.01"
parentId: "062.02.05"
title: Principles
---

```tsx
<Question id="AQEI7SEAHL" variant="definition" lo={["062.02.05.01.12"]}>
  <Text variant="oneCorrect" key="1">
    The ILS${subject} modulation frequency is...
  </Text>
  <Option key="1" subject={[["inner marker'"]]} why="true for inner marker">
    3000 Hz
  </Option>
  <Option key="1" subject={[["middle marker'"]]} why="true for middle marker">
    1300 Hz
  </Option>
  <Option key="1" subject={[["outer marker'"]]} why="true for outer marker">
    400 Hz
  </Option>
  <Option key="1" why="75MHz is the frequency of the carrier wave.">
    75 Mhz
  </Option>
  <Text variant="oneCorrect" key="2">
    The ILS visual signals when passing overhead a${subject} are...
  </Text>
  <Option key="2" subject={[["inner marker"]]} why="true for inner marker">
    white flashes
  </Option>
  <Option key="2" subject={[["middle marker"]]} why="true for middle marker">
    Amber flashes
  </Option>
  <Option key="2" subject={[["outer marker"]]} why="true for outer marker">
    Blue flashes
  </Option>
  <Option key="2">Red Flashes</Option>

  <Text variant="oneCorrect" key="3">
    The ILS${subject} audio frequency is keyed as follows...
  </Text>
  <Option key="1" subject={[["inner marker'"]]} why="true for inner marker">
    6 dots per second continuously
  </Option>
  <Option key="1" subject={[["middle marker'"]]} why="true for middle marker">
    a continuos series of dots and dashes
  </Option>
  <Option key="1" subject={[["outer marker'"]]} why="true for outer marker">
    2 dashes per second continuously
  </Option>
  <Option key="1">a continuos signal with no interruptions</Option>
</Question>
```

````tsx
<Question
  id="AQEI7SEAH2"
  id="VqTjeIMnmC"
  variant="definition"
  lo={["062.02.05.01.07"]}
>
  <Text variant="oneCorrect">
    An aircraft carrying out an ILS approach is receiving${subject}. The ILS
    indication will show
  </Text>
  <Option
    subject={[
      [
        "more 150Hz than 90Hz modulation from both the localizer and glide path transmitters'",
      ],
    ]}
  >
    Fly left and up
  </Option>
  <Option
    subject={[
      [
        "more 90Hz than 150Hz modulation from both the localizer and glide path transmitters'",
      ],
    ]}
  >
    Fly right and down
  </Option>
  <Option
    subject={[
      [
        "more 90Hz than 150Hz modulation from the  the localizer transmitter and more 150Hz than 90Hz from the glide path transmitter'",
      ],
    ]}
  >
    Fly right and up
  </Option>
  <Option
    subject={[
      [
        "more 150Hz than 90Hz modulation from the  the localizer transmitter and more 90Hz than 150Hz from the glide path transmitter'",
      ],
    ]}
  >
    Fly left and down
  </Option>

  <Explanation>
    The best way to remember this is to imagine a square with the 2 frequencies
    of an ILs at each corner: ``` 90Hz-----------| | | | + | | |
    |------------150Hz ``` If you are on centreline the 2 frequencies will be
    the same on both the glidescope and localizer. If you are getting, for
    example, more of 150Hz on both the localizer and glide path indicator, you
    can draw your location on the square: ``` 90Hz-----------| | | | + | | --0--
    | |------------150Hz ``` So basically, the ILS indication will show "Fly
    left, and up".
  </Explanation>
</Question>
````
