---
learningObjectiveId: "021.11.03.04"
parentId: "021.11.03"
title: Engine auxiliary gearbox
---

### Auxiliary gearbox

The auxiliary gearbox is a way to extract power from the turbine engine shaft
for uses other than providing thrust. This system is used to supply energy to
pretty much all other systems in an aircraft that require power, such as:

- Starter
- Oil pump
- Tachometers
- HP Fuel Pumps
- Hydraulic Pumps
- AC generator

```tsx
<Question
  id="A3UTDEXDG5"
  lo={["021.11.03.04.01"]}
  contentRef="### Auxiliary gearbox"
>
  <Text variant="oneCorrect">
    What accessory units is driven by the auxiliary gearbox of a turbo-jet
    engine?
  </Text>
  <Text variant="oneTwo">
    What accessory units are driven by the auxiliary gearbox of a turbo-jet
    engine?
  </Text>
  <Text variant="multipleCorrect" select={5}>
    What accessory units are driven by the auxiliary gearbox of a turbo-jet
    engine?
  </Text>
  <Option correct>Starter</Option>
  <Option correct>Oil pump</Option>
  <Option correct>Tachometers</Option>
  <Option correct>HP Fuel Pumps</Option>
  <Option correct>Hydraulic Pumps</Option>
  <Option correct>AC generator</Option>
  <Option why="Pneumatic systems are out of use in modern airliners, and are used only in emergency systems. Regardless, when they were in use, they relied on compressed &#x22;gas&#x22; canisters to supply the pressure to the system. These cannisters were not usually rechargeable  in flight, but when they were, they used a secondary system not directly powered by the auxiliary gearbox.">
    Thrust reverser pneumatic motors
  </Option>
  <Option why="Pneumatic systems are out of use in modern airliners, and are used only in emergency systems. Regardless, when they were in use, they relied on compressed &#x22;gas&#x22; canisters to supply the pressure to the system. These cannisters were not usually rechargeable  in flight, but when they were, they used a secondary system not directly powered by the auxiliary gearbox.">
    Pneumatic pumps
  </Option>

  <Option why="DC generators are not commonly used in aircraft. AC generators are used instead and a rectifier is used to convert AC to DC.">
    DC generators
  </Option>
</Question>
```
