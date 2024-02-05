---
id: "062.03.03.04"
parent: "062.03.03"
title: Errors, accuracy, limitations
---

```tsx
<Question id="0I013SN17J" lo={["062.03.03.04.01"]}>
  <Text variant="oneCorrect">
    What AWR procedure do you have to take into account if you line up on the
    RWY and there is a thunderstorm in front of you?
  </Text>
  <Option
    correct
    why="Predictive Wind shear should be set to AUTO, to make sure you get wind sheer warnings immediately after take off."
  >
    PWS set to AUTO
  </Option>
  <Option why="There is no reason to turn off AWR when already lined up on the runway.">
    AWR should be off
  </Option>
  <Option why="AS you are already on the ground, tilting the radar antenna down would be counter-productive.">
    Tilt should be down
  </Option>

  <Option why="As you are already lined up on the runway, there is no need to reduce radar intensity.">
    Radar intensity should be decreased
  </Option>
</Question>
```

```tsx
<Question id="0GM2QLXPO5" lo={["062.03.03.04.01"]}>
  <Text variant="oneCorrect">
    why should AWR be used with extreme caution when on the ground?
  </Text>
  <Option
    correct
    why="In general Radars are very powerful pieces of equipment transmitting very intense and concentrated beams of EM waves. Pointing these at people is a bad idea."
  >
    Using the AWR could expose ground personal and people in general to SHF
    radiation which can cause tissue damage when absorbed in long amounts
  </Option>
  <Option
    correct
    why="In general Radars are very powerful pieces of equipment transmitting very intense and concentrated beams of EM waves. Accidentally Pointing these at Fuel tanks could cause a localized heating and an explosion."
  >
    Using the AWR could cause the ignition of fuel vapors
  </Option>
  <Option>
    Radiation from the AWR can reflect off a close by surface and damage the AWR
    antenna due to too much radiation being received at once.
  </Option>
  <Option why="EM from a weather radar use a specific frequency and do not interfere with any other radar system in airport.">
    Radiation from the AWR can interfere with other radar services provided by
    the aerodrome (for example, PSR)
  </Option>
  <Option why="This is not true since radars usually point to the horizont and above. Only a madman would point the radar at the ground directly">
    Radiation from the AWR can reflect off the ground surface and will give a
    large number of false positives regarding the weather in front of the
    aircraft.
  </Option>

  <Option>
    Radiation from the AWR can reflect off the ground surface and cause an
    overheat of the radar antenna.
  </Option>
</Question>
```
