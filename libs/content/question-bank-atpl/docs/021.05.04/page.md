---
learningObjectiveId: "021.05.04"
parentId: "021.05"
title: "Aeroplane: fly-by-wire (FBW) control systems"
---

```tsx eval
<LearningObjectives learningObjectiveId={"021.05.04"} />
```

## Summary

- **PFC**: Primary Flight Computer. Receives Pilot commands, checks them for
  viability and errors, and converts them into the final digital signal to be
  sent to the **ACE**.
- **ACE**: Actuator Control Electronics. Recieves a digital signal from the
  **PFC** and converts it into an analogue signal to be sent to the **PCU**.
- **PCU**: Power Control Unit. Receives electric analogue and activates an
  Hydraulic actuator

```tsx
<Question id="2NR7C78UF6" lo={["021.05.04.01.02"]}>
  <Text variant="oneCorrect">
    Which of these statements reflect an advantage of Fly-By-Wire systems?
  </Text>
  <Text variant="oneTwo">
    Which of these statements is correct in regards to advantages of Fly-By-Wire
    systems?
  </Text>
  <Text variant="multipleCorrect" select={5}>
    The advantages of Fly-By-Wire control are...
  </Text>
  <Option subject={[[]]}>Reduced weight</Option>
  <Option subject={[[]]}>Improved piloting quality</Option>
  <Option>
    Reduction of electric and hydraulic power required to operate control
    surfaces
  </Option>
  <Option>Improved resistance against lightning strikes</Option>
  <Option>Immunity from interference signals</Option>
  <Option>Profile Drag Reduction</Option>
  <Option subject={[[]]}>Mach Number Reduction</Option>
  <Option subject={[[]]}>Increased Flight Envelope</Option>
</Question>
```

```tsx
<Question id="GTCTUJJC7R" lo={["021.05.04.01.03"]}>
  <Text variant="oneCorrect">
    A Fly by Wire system is always irreversible because...
  </Text>
  <Option correct>
    The link between the pilot inputs and control surfaces is done indirectly
    via a computer
  </Option>
  <Option>
    A pilot can reverse the inputs of the autopilot system as they also have a
    direct link to the hydraulic actuators of the control surfaces
  </Option>
  <Option>
    it is linked mechanically to a computer and then to the flight control
    surfaces
  </Option>
  <Option>
    the flight computer simulates the feedback of the control surface movement
    by applying a resistance force on the sidestick
  </Option>
</Question>
```

```tsx
<Question id="A3OEFMF4X6" lo={["021.05.04.01.04"]}>
  <Text variant="oneCorrect">
    In a Modern fly-by-wire system, what best describes "<Subject />" ?
  </Text>
  <Option
    subject={[["Normal Law"], ["Normal mode"]]}
    why="Normal Mode is the Boeing equivalent to Airbus' Normal Law"
  >
    Used throughout the entire flight from the chocks off to chocks on. It
    contains multiple submodules appropriate to each phase of flight that
    transition between each other automatically.
  </Option>
  <Option
    subject={[["Alternate Law"], ["Secondary Mode"]]}
    why="Secondary Mode is the Boeing equivalent to Airbus' Alternate Law"
  >
    A reduced mode of operation that is activated on deterioration of the
    fly-by-wire system. Most protections will remain active, while some will be
    replaced by warnings to the pilot.
  </Option>
  <Option
    subject={[["Direct Law"]]}
    why="This is an 'airbus only' mode. NOTE: this is not part of the LO's"
  >
    In this mode all protections are lost. The flight control movements are
    directly proportional to sidestick inputs.
  </Option>
  <Option
    subject={[["Mechanical Backup"]]}
    why="This is an 'airbus only' mode. NOTE: this is not part of the LO's"
  >
    In this mode control via primary control surfaces is not possible, and the
    aircraft is controlled by the stabilizer trim system and rudder pedals only.
  </Option>
  <Option why="No such a thing exists">
    A reduced mode of operation that activates in the most uneventful portions
    of the flight such as cruise.
  </Option>
</Question>
```

```tsx
<Question id="XK4SSFPEZD" lo={["021.05.04.01.04"]}>
  <Text variant="oneCorrect">
    On a fly-by-wire system which mode of operation is the most <Subject />
  </Text>
  <Option subject={[["basic"]]}>Direct Mode</Option>
  <Option subject={[["complete"]]}>Normal mode</Option>
  <Option subject={[["basic"]]}>Direct Mode</Option>
  <Option subject={[["complete"]]}>Normal Law</Option>
  <Option>Direct computer Mode</Option>
  <Option>Alternate mode</Option>
  <Option>Secondary mode</Option>
</Question>
```

```tsx
<Question id="9SHZGSOVWK" lo={["21.05.04.01.07"]}>
  <Text variant="oneCorrect">
    When operating an aircraft with a side stick, how can a captain take over
    flight control from either the co-pilot or the autopilot?
  </Text>
  <Option subject={[[]]}>
    By use of a takeover push button on the sidestick
  </Option>
  <Option>By saying out loud "I have control"</Option>
  <Option>By operating the sidestick in conjunction with the autopilot</Option>
  <Option>By operating the sidestick as the commander has priority</Option>
  <Option>
    By disarming the autopilot and disabling the copilot sidestick
  </Option>
</Question>
```
