---
learningObjectiveId: "021.11.05.01"
parentId: "021.11.05"
title: Thrust, performance aspects, and limitations
---

```tsx eval
<LearningObjectives learningObjectiveId={"021.11.05.01"} />
```

## Summary

### Thrust and SFC variations with altitude and TAS

For thrust, remember the following formula:

$$
T = \dot{m}_{jet}(V_{jet} - V_{aircraft}) \;[N]
$$

Thrust is the mass flow of hot gas ($kg/s$) times the difference between the
exhaust velocity and the aircraft velocity ($m/s$).

As altitude increases, air density decreases. As a consequence of this the mass
flow of hot gas decreases. The maximum velocity of the exhaust flow however
remains unchanged. Therefore, **As altitude increases, maximum thrust
decreases**.

For Specific Fuel Consumption, remember the following formula:

$$
SFC = \frac{\dot{m}_{fuel}}{Power}
      \;\; \left[ \frac{kg \cdot s^{-1}}{N s^{-1}} \right]
    = \frac{m_{fuel}}{Thrust}
      \;\; \left[ \frac{kg}{N} \right]
$$

**Remember**: Specific Fuel consumption is the amount of fuel consumed per unit
thrust.

We saw before that maximum thrust is decreasing with increasing altitude.
However, Fuel Consumption also decreases with increasing altitude. As less air
is flowing through the jet (decreasing $\dot{m}_{jet}$) less fuel needs to be
combusted as engines operate at a constant fuel/air ratio.

At the end of the day you just have to memorize that the decrease in fuel
consumption is superior to the decrease of thrust. This is howeve quite easy to
remember. Jets like to fly as high as possible to save as much fuel as possible.
This is because **flying at higher altitudes decreases the SFC**.

Variations of **SFC** and maximum **T** with airspeed are much simpler to reason
with.

Looking back to the formula $$T = \dot{m}_{jet}(V_{jet} - V_{aircraft})$$, in an
extreme case where the aeroplane speed catches up with the jet exhaust speed,
Thrust is zero. In reverse if the aeroplane is stationary Thrust is maximum.

SFC follows a similar pattern: The faster you go the more fuel you spend and the
least amount of power you produce. **Keep in mind that is an analysis of the
engine SFC, not the aircraft!** Aerodynamic effects, that cause a parabolic
looking curve for SFC are not considered here. \*\*SFC is minimum with zero
speed and increases to infinity as TAS increases.

<Question
  id="I9V962NGD7"
  lo={["021.11.05.01.01", "021.11.05.01.02"]}
  contentRef="### Thrust and SFC variations with altitude and TAS"
>
  <Text variant="oneCorrect">
    What statement about a Jet Engine performance is correct?
  </Text>
  <Text variant="oneTwo">
    What statement about a Jet Engine performance are correct?
  </Text>
  <Text variant="multipleCorrect" select={4}>
    What statement about a Jet Engine performance are correct?
  </Text>
  <Option key={1} correct>
    The maximum thrust decreases as pressure altitude increases
  </Option>
  <Option key={1} correct>
    The maximum thrust increases as pressure altitude decreases
  </Option>
  <Option key={1}>
    The maximum thrust decreases as pressure altitude decreases
  </Option>
  <Option key={1}>
    The maximum thrust increases as pressure altitude increases
  </Option>
  <Option key={2} correct>
    The SFC decreases as pressure altitude increases at a constant TAS
  </Option>
  <Option key={2} correct>
    The SFC increases as pressure altitude decreases at a constant TAS
  </Option>
  <Option
    key={2}
    correct
    why="This is just a more mathematically robust way of saying that the SFC decreases as altitude increases"
  >
    The SFC is inversely proportional to pressure altitude increases at a
    constant TAS
  </Option>
  <Option key={2}>
    The SFC decreases as pressure altitude decreases at a constant TAS
  </Option>
  <Option key={2}>
    The SFC increases as pressure altitude increases at a constant TAS
  </Option>
  <Option
    key={2}
    why="The opposite is true. The SFC is inversely proportional to pressure altitude."
  >
    The SFC is directly proportional to pressure altitude increases at a
    constant TAS
  </Option>
  <Option key={3} correct>
    The maximum thrust decreases as TAS increases at a constant altitude
  </Option>
  <Option key={3} correct>
    The maximum thrust increases as TAS decreases at a constant altitude
  </Option>
  <Option key={3}>
    The maximum thrust decreases as TAS decreases at a constant altitude
  </Option>
  <Option key={3}>
    The maximum thrust increases as TAS increases at a constant altitude
  </Option>
  <Option key={4} correct>
    The SFC increases as TAS increases at a constant Pressure Altitude
  </Option>
  <Option key={4} correct>
    The SFC decreases as TAS decreases at a constant Pressure Altitude
  </Option>
  <Option key={4}>
    The SFC increases as TAS decreases at a constant Pressure Altitude
  </Option>
  <Option key={4}>
    The SFC decreases as TAS increases at a constant Pressure Altitude
  </Option>
</Question>
```
