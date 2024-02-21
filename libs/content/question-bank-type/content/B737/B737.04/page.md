---
id: B737.04
questionBank: "type"
parent: B737
title: "Automatic Flight"
---

**Note**: This is just a summary of the FCOM content that regularly shows up in
Type Rating exams. For an overview of the systems in this chapter, check the
FCOM

> AFDS = (Autopilot + Flight Directors + Autothrottle)

When CMD A is engaged, FCC A controls the flight directors and uses hydraulic
system A to control the aircraft. The reverse is true with CMD B.

Flight directors function independently in certain cases: Dual Channel approach,
T/O or G/A below 400ft.

Autopilot disengages when:

- Pressing the CMD switch or A/P disengage bar
- Activating the control wheel trim switch
- Stab trim autopilot cutout switch in the cutout position
- Left or Right IRS failure
- Interruption of electrical power in the related AC transfer bus
- Loss of hydraulic pressure in the related system

## AFDS MODES

| **Autothrottle Modes** | **Roll Modes** | **Pitch Modes** |
| ---------------------- | -------------- | --------------- |
| N1                     | LNAV           | TO/GA           |
| GA                     | HDG SEL        | VNAV (PTH/SPD)  |
| RETARD                 | VOR/LOC        | V/S             |
| MCP SPD                |                | ALT ACQ         |
| FMC SPD                |                | ALT HOLD        |
| THR HLD                |                | MCP SPD         |
| ARM                    |                | G/S             |
|                        |                | FLARE           |

## LNAV Engagement Criteria in Flight

- Active route entered in the FMC
- Within 3nm, LNAV engages with any heading
- Outside 3nm, LNAV engagement requires the aircraft to be on a 90° intercept or
  lessbefore the next waypoint.

## TO/GA during Takeoff

- Pressing TO/GA commands autothrottle to the N1 set in the FMC, FD shows 10°
  nose down
- At 60kt, FD shows 15° nose up, THR HLD annunciated, and autothrottle servos
  inhibited
- At liftoff, FD shows 15° nose up until sufficient climb is achieved, then
  command pitch to maintain V2+20
- Below 400ft, bank is limited to 8°
- At 800ft, ARM is annunciated
- At thrust reduction altitude, N1 is annunciated, and thrust is reduced to
  climb thrust set in the FMC
- At autopilot engagement, TO/GA terminates, and pitch mode reverts to MCP SPD

TO/GA Go-Around mode is available below 2000ft RA or above 2000ft RA with flaps
not up or G/S capture.

## DUAL CHANNEL APPROACH

**Limitations:**: 2 autopilots, flaps 30°/40°, headwind below 25kt, crosswind
below 20kt, tailwind below 10kt

**Sequence:**:

- Engage CMD A and CMD B when cleared for approach; SINGLE CH stays annunciated
- LOC capture occurs before half a dot
- G/S capture occurs at 2/5 of a dot, N1 thrust limit changes to G/A
- Below 1500ft RA:
- the second autopilot couples with the flight controls and CMD is annunciated
- A test of the ILS deviation monitor is made and G/S LOC flashes amber
- FLARE is armed, Autopilot G/A is also armed but not shown
- At 400ft RA, the stabilizer is automatically trimmed nose up for go-around
- At 350ft RA, if FLARE is not armed, AP disengages
- At 50ft RA, FLARE mode is engaged, FD retracts from view
- At 27ft, Autothrottle RETARD is engaged, commands idle, and disconnects 2s
  after touchdown
