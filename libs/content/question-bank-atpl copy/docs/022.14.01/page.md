---
learningObjectiveId: "022.14.01"
parentId: "022.14"
title: Cockpit voice recorder (CVR)
---

```tsx
<Question
  id="GQCH63B2G4"
  lo={["022.14.01.01.01", "022.14.02.01.01", "022.14.03.03.01"]}
>
  <Text variant="oneCorrect">
    What is the purpose of a <Subject />?
  </Text>
  <Option subject={[["CVR"], ["Cockpit Voice Recorder"]]}>
    Recording cockpit sounds for incident and accident investigations.
  </Option>
  <Option subject={[["FDR"], ["Flight Data Recorder"]]}>
    Recording of altitude, heading, speed, etc. for incident and accident
    investigations.
  </Option>
  <Option
    subject={[
      ["FDR together with a ACMS"],
      [
        "Flight Data Recorder together with an Aeroplane Condition Monitoring System",
      ],
    ]}
  >
    Recording of altitude, heading, speed, etc. for incident and accident
    investigations and maintenance trouble-shooting.
  </Option>
  <Option>
    Recording cockpit sounds to serve as evidence in criminal charges or
    insurance claims.
  </Option>
  <Option>
    Recording of altitude, heading, speed, etc. to serve as evidence in criminal
    charges or insurance claims.
  </Option>
  <Option>
    Recording cockpit sounds to be assist maintenance crews with additional data
    of aircraft performance.
  </Option>

  <Option>
    Recording of altitude, heading, speed, etc. to be assist maintenance crews
    with additional data of aircraft performance.
  </Option>
</Question>
```

```tsx
<Question id="GQCH63B2G3" lo={["022.14.01.01.02", "022.14.02.01.02"]}>
  <Text variant="oneCorrect">
    Which of the following is a main component of a <Subject />?
  </Text>
  <Text variant="multipleCorrect" select={5}>
    Which of the following are main components of a <Subject />?
  </Text>
  <Option subject={[["CVR"], ["Cockpit Voice Recorder"]]}>
    A shock resistant tape recorder or digital storage associated with an ULB
  </Option>
  <Option subject={[["CVR"], ["Cockpit Voice Recorder"]]}>
    A control unit with a "auto/on", test and erase functions, and a headset
    jack.
  </Option>
  <Option subject={[["CVR"], ["Cockpit Voice Recorder"]]}>
    Limited flight deck controls such as erase and test switches
  </Option>
  <Option subject={[["CVR"], ["Cockpit Voice Recorder"]]}>
    An area microphone
  </Option>
  <Option subject={[["FDR"], ["Flight Data Recorder"]]}>
    A shock resistant data recorder associated with an ULB
  </Option>
  <Option subject={[["FDR"], ["Flight Data Recorder"]]}>
    Two control units: Start sequence, and event mark setting
  </Option>
  <Option subject={[["FDR"], ["Flight Data Recorder"]]}>
    Limited flight deck controls, but include an event switch
  </Option>
  <Option subject={[["FDR"], ["Flight Data Recorder"]]}>
    A data interface and acquisition unit
  </Option>

  <Option subject={[["FDR"], ["Flight Data Recorder"]]}>
    A recording system (digital flight recorder)
  </Option>
</Question>
```
