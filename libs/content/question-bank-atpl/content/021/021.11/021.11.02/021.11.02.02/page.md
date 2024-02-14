---
id: "021.11.02.02"
parent: "021.11.02"
questionBank: "atpl"
title: Compressor and diffuser
---

### Compressor stall and Surge

Compressor blades are aerofoils, and if a too high angle of attack exists
between the blade and the incoming airflow a stall will occur. When such a stall
occurs over one blade, or a limited number of blades we are in the presence of a
_Compressor Stall_.

Compressor stalls always begins at the first stages of a compressor and travel
deeper and deeper into to the turbine as they develop. If the entire compressor
is stalled, we are in the presence of a _Compressor Surge_. When a compressor
surge develops, Velocity decreases inside the compressor and conversely static
pressure rapidly increases. This will eventually lead to a flow reversal which
in turn will _choke_ the combustion chambers and lead to a flame-out.

Compressor stall and surge are more common when the engine is at low RPMs

```tsx ignore
<Question id="YVGGRRTEBH" lo={["021.11.02.02.09", "021.11.02.04.09"]}>
  <Text variant="oneCorrect">
    Which of the following statements are true regarding the flow in a
    <Subject /> subsonic gas turbine engine intake?
  </Text>
  <Option
    subject={[["convergent"]]}
    why="If the cross sectional area is decreasing, and mass flow is assumed constant, the average speed of the flow must be assumed to increase. If the speed of the flow increases so does the dynamic pressure."
  >
    The dynamic pressure increases
  </Option>
  <Option
    subject={[["convergent"]]}
    why="If the cross sectional area is decreasing, and mass flow is assumed constant, the average speed of the flow must be assumed to increase."
  >
    The flow velocity increases
  </Option>
  <Option
    subject={[["convergent"]]}
    why="Both temperature and pressure follow the same pattern. As total temperature must remain constant, if dynamic temperature increases, static temperature decreases."
  >
    The static pressure decreases
  </Option>
  <Option
    subject={[["convergent"]]}
    why="Both temperature and pressure follow the same pattern. As total Pressure must remain constant, if dynamic pressure increases, static pressure decreases."
  >
    The static pressure decreases
  </Option>
  <Option
    subject={[["divergent"]]}
    why="If the cross sectional area is decreasing, and mass flow is assumed constant, the average speed of the flow must be assumed to increase. If the speed of the flow increases so does the dynamic pressure."
  >
    The dynamic pressure increases
  </Option>
  <Option
    subject={[["divergent"]]}
    why="If the cross sectional area is decreasing, and mass flow is assumed constant, the average speed of the flow must be assumed to increase."
  >
    The flow velocity increases
  </Option>
  <Option
    subject={[["divergent"]]}
    why="Both temperature and pressure follow the same pattern. As total temperature must remain constant, if dynamic temperature increases, static temperature decreases."
  >
    The static pressure decreases
  </Option>
  <Option
    subject={[["divergent"]]}
    why="Both temperature and pressure follow the same pattern. As total Pressure must remain constant, if dynamic pressure increases, static pressure decreases."
  >
    The static pressure decreases
  </Option>
  <Option
    subject={[["divergent"], ["convergent"]]}
    why="Total temperature and pressure remain constant when going through a duct."
  >
    The total pressure decreases
  </Option>

  <Option
    subject={[["divergent"], ["convergent"]]}
    why="Total temperature and pressure remain constant when going through a duct."
  >
    The total pressure decreases
  </Option>
</Question>
```

```tsx ignore
<Question
  id="K8DCDLL0FU"
  id="jmV92WWwuZ"
  lo={["021.11.02.02.17", "021.11.02.02.19"]}
>
  <Text variant="oneCorrect">
    What is the purpose of variable by-pass valves on high bypass turbofan
    engines situated between the LP and HP compressors?
  </Text>
  <Option id="jmV92WWwuZ-1" subject={[[]]} why="">
    To prevent fan stall and LP compressor stall during engine start.
  </Option>
  <Option id="jmV92WWwuZ-2" subject={[[]]} why="">
    To prevent fan stall and LP compressor stall during low RPM settings.
  </Option>
  <Option
    id="jmV92WWwuZ-3"
    why="This answer contradicts itself as Fan surges are an event that develops at low rotor speeds"
  >
    To prevent fan surge at high rotor speeds.
  </Option>
  <Option
    id="jmV92WWwuZ-4"
    why="The bypass valves remove air that would otherwise flow from the LP compressor into the HP compressor. This answer therefore makes no sense as this bypass valves cannot help provide additional air to the HP compressor."
  >
    To provide sufficient air to the HP compressor during engine start.
  </Option>
  <Option
    id="jmV92WWwuZ-5"
    why="This option makes no sense as compressor stall develops in the Low pressure compressor, not the high pressure compressor."
  >
    To prevent HP compressor stall during engine Start
  </Option>
  <Option
    id="jmV92WWwuZ-6"
    why="This option makes no sense as compressor stall develops in the Low pressure compressor, not the high pressure compressor."
  >
    To prevent HP compressor stall during engine low RPM settings
  </Option>

  <Explanation>
    Two things to keep in mind: * Compressor stall develops in the most forward
    stages of the compressor (low pressure stages first). * Compressor stall can
    be avoided / mitigated, by allowing the air to flow away from the back of
    the compressor. For this reason a bypass valve can be installed between the
    low pressure and high pressure compressors, allowing air that would
    otherwise flow into the HP compressor to flow outside the engine. This
    allows the pressure in the LP compressor to drop, which in turn allows the
    air to flow more "easily" through the LP compressor reducing the risk of
    stall.
  </Explanation>
</Question>
```
