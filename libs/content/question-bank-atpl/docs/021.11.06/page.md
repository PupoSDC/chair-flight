---
learningObjectiveId: "021.11.06"
parentId: "021.11"
title: Auxiliary power unit (APU)
---

1.  **021.11.06.01.01** -- State that an APU is a gas turbine engine and list
    its tasks.
2.  **021.11.06.01.02** -- State the difference between the two types of APU
    inlets.
3.  **021.11.06.01.03** -- Define "maximum operating and maximum starting
    altitude".
4.  **021.11.06.01.04** -- Name the typical APU control and monitoring
    instruments.
5.  **021.11.06.01.05** -- Describe the APU"s automatic shutdown protection.

|                 | ATPL(A) | CPL(A) | ATPL(H)/IR | ATPL(H)/VFR | CPL(H) | IR  | CBIR(A) |
| --------------- | ------- | ------ | ---------- | ----------- | ------ | --- | ------- |
| 021.11.06.01.01 | X       |        | X          | X           |        |     |         |
| 021.11.06.01.02 | X       |        | X          | X           |        |     |         |
| 021.11.06.01.03 | X       |        | X          | X           |        |     |         |
| 021.11.06.01.04 | X       |        | X          | X           |        |     |         |
| 021.11.06.01.05 | X       |        | X          | X           |        |     |         |

## Summary

Auxiliary Power Units (APU)s are small gas turbines usually located at the back
of the aircraft that drive an electrical generator to power aircraft systems.
They are typically used on the ground before the main engines are turned on.

Additional to supplying electrical power, APUs can also supply compressed air
for starting the main engine or for air conditioning

Due to its secondary role, APUs rely on only a "Fault status" indicator to be
monitored. Similarly, APUs are usually started by a flick of a switch.

Since the APU primary role is to supply electrical power, its setup is
significantly simpler than the one for main engines, mostly because there is no
need for a Constant Speed Drive: the APU already operates at a constant speed.
However, because of this it's not possible to run this generator in parallel
with the main engine generators. As such, when selecting the APU as a power
source, the other sources are disconnected. Regardless, as all other generators,
the APU supplies power in three-phase, 115-120V, 400Hz AC.

APUS must be equipped with an automatic shutdown protection system that
activates when:

- EGT limit is exceeded,
- APU Fire
- Low oil pressure
- High oil temperature

In any engine, Low oil pressure typically indicates a leak, which will
eventually result in either overheating or not enough lubrication causing
mechanical damage. High oil pressure is usually not problematic and is kept in
check by pressure release valves.

Remember: `High Temperature and Low Pressure => BAD!`.

```tsx
<Question id="LFS7CP9SL2" lo="021.11.06.01.01">
  <Text variant="oneCorrect">
    An APU is designed to provide power for ground operations, but it can also
    supply:
  </Text>
<Option why="The APU cannot supply thrust">
  Air conditioning and thrust in the event of engine failure
</Option>
<Option>
  Either air conditioning or electrical services, but not both at the same time
</Option>
<Option why="the APU never provides hydraulic power directly.">
  Air conditioning and electrical services on the ground, and electrical and
  hydraulic back up services in the air.
</Option>

  <Option correct>Air conditioning and electrical services</Option>
</Question>
```

```tsx
<Question id="JG9GDLCXB9" lo="021.11.06.01.04">
  <Text variant="oneCorrect">
    Which Parameter is indicated during APU Start
  </Text>
<Text variant="oneCorrect">
  Which indication should be monitored when operating an APU
</Text>

  <Option correct>Fault status</Option>
  <Option>Oil Temperature</Option>
  <Option>MAP</Option>
  <Option>APU fuel pumps</Option>
  <Option>Fuel Consumption</Option>
  <Option>EGT</Option>
  <Option>N1</Option>
</Question>
```

```tsx
<Question id="JG9GDLCXB8" lo="021.11.06.01.01">
  <Text variant="multipleCorrect" select={6}>
    On the ground the APU can provide:
  </Text>

  <Text variant="oneTwo">On the ground the APU can provide:</Text>
  <Option correct>Electricity</Option>
  <Option correct>Air for starting the main engine</Option>
  <Option correct>Air for air conditioning</Option>
  <Option correct>Thrust to taxi the aircraft</Option>
  <Option>Hydraulic Pressure</Option>
</Question>
```

```tsx
<Question id="JG9GDLCXB7" lo="021.11.06.01.01">
  <Text variant="oneCorrect">The APU has its own AC generator which</Text>
<Option correct>
  supplies the aircraft with three phase, 115 v, 400 Hz AC
</Option>
<Option>is excited by the generator control unit</Option>
<Option why="The APU already operates at a constant speed, so there is no need for a CSD">
  is driven by a constant speed drive
</Option>
<Option why="it is usually not possible to run the APU in parallel with the main generator">
  has the same characteristics of the main generator so they can be ran in
  parallel
</Option>

  <Option correct>
    can not be coupled in parallel with the main generators
  </Option>
</Question>
```

```tsx
<Question id="JG9GDLCXB6" lo="021.11.06.01.05">
  <Text variant="multipleCorrect" select={6}>
    What would cause an APU to automatically shut down?
  </Text>
<Option why="High oil pressure is prevented by pressure relief valves.">
  High oil pressure
</Option>
<Option
  correct
  why="Most likely indicates a leak in the oil system, which will lead to damage, or even fire. Remember: High oil Temperature, and Low oil Pressure = Bad"
>
  Low oil pressure
</Option>
<Option
  correct
  why="Remember: High oil Temperature, and Low oil Pressure = Bad"
>
  High oil Temperature
</Option>
<Option
  correct
  why="Low oil temperature is usually not cause for concern. Remember: High oil Temperature, and Low oil Pressure = Bad"
>
  Low oil Temperature
</Option>
<Option correct why="Indicates over heating, which can lead to damage, or fire">
  High EGT
</Option>
<Option why="Overspeed can cause fatal damage to the APU">Low APU speed</Option>
<Option correct why="Overspeed can cause fatal damage to the APU">
  Overspeed
</Option>

  <Option correct why="In general having your aircraft on fire is considered a bad idea">
    APU fire
  </Option>
</Question>
```
