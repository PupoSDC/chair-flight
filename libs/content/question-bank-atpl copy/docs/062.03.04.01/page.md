---
learningObjectiveId: "062.03.04.01"
parentId: "062.03.04"
title: Principles
---

```tsx
<Question id="M3B7UEDWXK" lo={["062.03.04.01.04"]}>
  <Text variant="oneCorrect">
    Which of the following constitutes an advantage of SSR when compared to a
    PSR system?
  </Text>
  <Text variant="oneCorrect">
    Which of the following constitutes an advantage of Secondary surveillance
    Radar when compared to a Primary surveillance Radar system?
  </Text>
  <Text variant="oneTwo">
    Which of the following constitute an advantage of SSR when compared to a PSR
    system?
  </Text>
  <Text variant="oneTwo">
    Which of the following constitute an advantage of Secondary surveillance
    Radar when compared to a Primary surveillance Radar system?
  </Text>
  <Text variant="multipleCorrect" select={4}>
    Which of the following constitute an advantage of Secondary surveillance
    Radar when compared to a Primary surveillance Radar system?
  </Text>
  <Option
    correct
    why="As each signal only needs to follow one path (instead of all possible paths in the sky) attenuation is significantly decreased reducing power consumption"
  >
    The required power of transmission from the ground equipment is reduced
  </Option>
  <Option
    correct
    why="Contrary to normal radars SSR relies on a response sent directly from the aircraft transponder. The best of stealth aircraft would still be clearly visible on radar, if they have their transponders on."
  >
    The quality of radar identification is not dependent on the target size,
    aspect, shape, or material
  </Option>
  <Option
    correct
    why="Transponders communicate at least a transponder code (7000, 2000, etc...), but can also transmit altitude and identification information."
  >
    Ground stations can obtain coded information from the surveilled aircraft
    such as identification and altitude
  </Option>
  <Option subject={[[]]}>
    ATC SSR systems can interrogate aircraft transponders and elicit replies
  </Option>
  <Option why="This is false. SSR still requires line of sight to operate">
    Is not limited by line of sight
  </Option>
  <Option why="This information is not transmitted by SSR. It can be derived from multiple SSR interrogations but it's not coded information from the surveilled aircraft.">
    Ground stations can obtain coded information from the surveilled aircraft
    such as speed and heading
  </Option>
  <Option why="SSR still emits side lobes.">
    The relatively small ground antenna transmits no side lobes, thus
    eliminating the danger of false replies from the airborne transponder.
  </Option>

  <Option why="The flow of information is the other way around. The Ground system is the one making interrogations.">
    ATC SSR systems can reply to an aircraft interrogation and provide elicit
    replies
  </Option>
</Question>
```
