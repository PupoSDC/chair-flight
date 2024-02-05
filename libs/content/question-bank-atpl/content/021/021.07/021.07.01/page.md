---
id: "021.07.01"
parent: "021.07"
title: Types, operation, indications
---

... and warnings, operational limitations

```tsx
<Question id="9O2VP4ZBFX" lo="021.07.01.01.02">
  <Text variant="multipleCorrect" select={4}>
    The elements that must be protected using an anti-icing in a turboprop
    aircraft are...
  </Text>
  <Text variant="oneCorrect">
    Which of these elements needs to be protected using an anti-icing system in
    a turboprop aircraft?
  </Text>
  <Option correct>Engine Inlets</Option>
  <Option correct>Pitot tubes</Option>
  <Option correct>Static Ports</Option>
  <Option>APU inlet</Option>
  <Option why="In medium sized turbo-prop aircraft, wings usually have the inflatable boot system, which is a de-icing system">
    Wings
  </Option>

  <Option why="turboprops usually do not operate at temperatures requiring heating for the correct functioning of waste water exhausts.">
    Waste water exhaust
  </Option>
</Question>
```

```tsx
<Question id="V4OY3M6VPZ" lo="021.07.01.01.02">
  <Text variant="multipleCorrect" select={5}>
    The elements that must be protected against icing on a large transport
    aircraft are...
  </Text>
  <Text variant="oneCorrect">
    Which of these elements needs to be protected against icing on a large
    transport aircraft?
  </Text>
  <Explanation>
    Aeroplanes certified for IFR flight in known icing conditions...
  </Explanation>
  <Option correct>Engine air intake and pod</Option>
  <Option correct>Front glass shield</Option>
  <Option correct>Pitot tubes and waste water exhaust masts</Option>
  <Option correct>Leading edges of wings</Option>
  <Option why="Ice aggregates on leading edges, not trailing edges ">
    Trailing edge of wings
  </Option>
  <Option why="The radome, the dome in the nose of the aircraft containing the weather radar, is not critical for ice protection">
    Radome
  </Option>
  <Option why="Ice does not aggregate in significant quantities in the fuselage, and if it does it does not affect significantly the safe operation of the aircraft">
    Cabin windows
  </Option>

  <Option why="Electronic components are usually rated to operate at temperatures significantly lower than those found at 40 thousand ft">
    Electronic equipment compartment
  </Option>
</Question>
```
