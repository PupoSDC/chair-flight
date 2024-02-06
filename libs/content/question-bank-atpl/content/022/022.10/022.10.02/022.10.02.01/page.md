---
id: "022.10.02.01"
parent: "022.10.02"
title: Versions, applications, CPDLC messages, ADS contracts
---

### ATS facility notification (AFN);

### automatic dependent surveillance (ADS);

### CPDLC.

Controller Pilot Data Link Communication contains the stack of predefined
messages and formats on the (M)CDU that allow the pilot to communicate with ATC.
Clearances and messages are exchanged via the CPDLC standards and protocols

```tsx
<Question id="CP3BX5VU6B" lo={["022.10.02.01.01"]}>
  <Text variant="oneCorrect">What is the FANS concept?</Text>
  <Text variant="oneCorrect">
    What is the Future Air Navigation System concept?
  </Text>
  <Option subject={[[]]}>
    An ICAO concept used in FANS airspace over the oceans to allow for smoother
    traffic flows.
  </Option>
  <Option subject={[[]]}>
    An ICAO concept to allow for a safe and efficient use of a given airspace by
    the maximum possible number of aircraft.
  </Option>
  <Option>
    An ICAO concept ot automate the distribution of departure slots
  </Option>
  <Option>
    An EASA concept used in FANS airspace over the oceans to allow for smoother
    traffic flows.
  </Option>
  <Option>
    An FAA concept used in FANS airspace over the oceans to allow for smoother
    traffic flows.
  </Option>
  <Option>
    An EASA concept to provide safe, efficient, and cost effective communication
    system
  </Option>
  <Option>An old standard for software certification in aviation.</Option>

  <Option>
    A concept each manufacturer has to implement when developing radio
    navigation equipment for use within the EU.
  </Option>
</Question>
```

```tsx
<Question id="NJDX3WKYYB" lo={["022.10.02.01.02"]}>
  <Text variant="oneCorrect">
    A <Subject /> system makes used of the...
  </Text>
  <Text variant="oneTwo">
    A <Subject /> system makes used of the...
  </Text>
  <Option subject={[["FANS 1"], ["FANS A"], ["FANS 2"], ["FANS B"]]}>
    ACARS Network
  </Option>

  <Option subject={[["FANS 2"], ["FANS B"]]}>ATN Netwok</Option>
  <Option why="There is no such thing as a PBN network">PBN network</Option>
  <Option why="There is no such thing as a FDR network">FDR network</Option>
</Question>
```

```tsx
<Question id="NJDX3WKYYA" lo={["022.10.02.01.03"]}>
  <Text variant="oneCorrect">
    What is the purpose of <Subject /> system in a FANS application
  </Text>
  <Option subject={[["an ADS"], ["an Automatic Dependent Surveillance"]]}>
    Sending automatically aircraft surveillance data to the air traffic
    controller.
  </Option>
  <Option subject={[["an AFN"], ["an ATS facility notification"]]}>
    Enabling the log-on and handover of the FANS-equipped aeroplane to the ATC
    ground facilities.
  </Option>
  <Option
    subject={[["a CPDLC"], ["a Controller Pilot Data Link Communication"]]}
  >
    It contains the stack of predefined messages and formats on the (M)CDU that
    allow the pilot to communicate with ATC.
  </Option>

  <Option why="The closest to this is the transponder in mode C. But no intentions are transmitted.">
    It broadcasts the aircraft position and intents to other aircraft in the
    vicinity.
  </Option>
</Question>
```
