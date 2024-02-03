---
learningObjectiveId: "062.06.01.03"
parentId: "062.06.01"
title: Errors and factors affecting accuracy
---

### Ionospheric propagation delay

### Dilution of precision

GPS systems are based on the principle of triangulation, that is, the
determination of a position based on the distance from a set of know positions.
The quality of this determination is directly proportional to the position of
the satellites. If the satellites are closely positioned the quality of the
"triangulation" will be significantly poorer than if you have a set of
satellites that are well separated.

### Satellite clock error

The satellite atomic clock can and will experience noise and clock drift errors.
This error can be measured by comparing the atomic clock reading with ground
atomic clocks. The clock error is sent to receivers as part of the navigation
message.

Together with satellite orbital variations, clock errors are known as "Ephemeris
errors".

### Satellite orbital variations

Satellite position is subject to error caused by gravitational forces of
celestial bodies, solar winds, among others. The precise position of a satellite
is checked every 12 hours and the up to date position error is sent to receivers
as part of the navigation message.

Together With clock errors, orbital variation errors are known as "Ephemeris
errors".

### Multipath Effects

GPS signals can reflect off terrain and buildings arriving at the receiver with
delays. Multipath errors due to long bounces, are easy to identify and discard.
Errors from small bounces are significantly harder, but can be minimized by
using specialized antennas that better measure the "direction" of the incoming
signal and split bounced signals based on their incoming direction.

```tsx
<Question id="QJ03TX610J" lo={["062.06.01.03.01"]} contentRef="## Summary">
  <Text variant="oneCorrect">
    Which of the following is a source error that affects the accuracy and
    reliability of GPS systems
  </Text>
  <Text variant="oneTwo">
    Which of the following are a source error that affects the accuracy and
    reliability of GPS systems
  </Text>
  <Text variant="multipleCorrect" select={5}>
    Which of the following are a source error that affects the accuracy and
    reliability of GPS systems
  </Text>
  <Text variant="oneCorrect">
    One of the more significant errors that reduces the accuracy of the GNSS
    signal-in-space is ...
  </Text>
  <Option correct why="Satellite atomic clocks drift leading to errors">
    Satellite clock
  </Option>
  <Option
    correct
    why="Satellite orbits change slightly due to gravitational effects and solar winds leading to errors"
  >
    Satellite Ephemeris
  </Option>
  <Option correct why="Describes the source of errors of Satellite Ephemeris">
    Solar winds and gravitation of the sun, moon, and planets
  </Option>
  <Option correct why="A tight clustering causes dilution of precision errors">
    Tight Clustering of satellites
  </Option>
  <Option correct why="Causes ionospheric propagation delay">
    Atmospheric Propagation
  </Option>
  <Option correct why="Describes multipath effects">
    Reflection of satellite signals from terrain
  </Option>
  <Option correct>
    dilution of precision caused by the relative positions of the navigation
    satellites.
  </Option>
  <Option why="The existence of a Satellite - ground lag is the working principle of GPS, not a source of error">
    Satellite ground time lag
  </Option>
  <Option why="Satellite signals do not interfere with each other." key={1}>
    Satellite mutual interference
  </Option>
  <Option why="" key={1}>
    interference from other space vehicles operating in the same frequency band.
  </Option>
  <Option why="There is no such thing as frequency drift. Only clock drift">
    Frequency Drift
  </Option>
  <Option why="No such thing as lunar winds exist">
    Lunar winds and gravitation of the sun, moon, and planets
  </Option>
  <Option why="These do not cause satellite errors directly.">
    Earth and Lunar precession
  </Option>
  <Option why="These do not cause satellite errors directly.">
    Solar and Lunar precession
  </Option>

  <Option why="GNSS is affected by ionospheric errors, not tropospheric.">
    tropospheric propagation delay caused by pollution in lower atmospheric
    layers
  </Option>
</Question>
```
