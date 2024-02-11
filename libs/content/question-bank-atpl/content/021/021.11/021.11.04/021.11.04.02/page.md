---
id: "021.11.04.02"
parent: "021.11.04"
questionBank: "atpl"
title: Starting malfunctions
---

### Tailpipe fire (torching)

An ignition of fuel that has previously puddled in the the turbine casing or
exhaust section. One of the most common scenarios for this to happen is after a
failed start attempt.

When this event occours a visible flame can be seen escaping from the exhaust
pipe. entering will increase but an engine fire warning is not triggered.

### Hot start

**NOTE: Hot start for turbine and piston engines are different phenomena**

Hot start is caused by improper start technique. When starting a jet engine, the
compressor is spooled up to generate enough cooling flow around the combustion
chamber, before ignition is attempted.

Incorrect fuel scheduling, i.e.: starting ignition too soon, can cause a hot
start since there is not enough cooling flow to keep the combustion stable.
Temperature in the combustion chamber will increase rapidly leading to damage.

Another cause pilot's should be aware for hot starts, is starting the engine
with a strong tail wind. The wind will reduce the amount of air flow around the
combustion chamber potentially leading to a hot start.

[Source](https://en.wikipedia.org/wiki/Hot_start)

### Abortive (hung) start

### No N1 rotation

### Freewheel failure

### No FADEC indications

```tsx
<Question id="4I52DMOX7R" lo="021.11.04.02.01">
  <Text variant="oneCorrect">
    Name the possible cause and indications of a <Subject />.
  </Text>
  <Option subject={[["tailpipe fire"]]}>
    Fuel that has puddled in the turbine casing or exhaust during start-up may
    ignite. It can cause a well visible jet flame from the reward side of the
    engine
  </Option>
  <Option subject={[["hot start"]]}>
    The engine is started too early before enough air flow exists around the
    combustion chamber, resulting in a rapid increase of EGT beyond limits.
  </Option>
  <Option why="Describes a tailpipe fire, however, EGT will increase, not remain constant.">
    Fuel that has puddled in the turbine casing or exhaust during start-up may
    ignite. EGT will remain constant.
  </Option>
  <Option why="Describes a tailpipe fire, however, an engine fire alarm is not usually triggered.">
    Fuel that has puddled in the turbine casing or exhaust during start-up may
    ignite. An engine fire warning will trigger in the cockpit.
  </Option>

  <Option why="describe a hot start, except that in a hot start the engine does not flame out.">
    The engine is started too early before enough air flow exists around the
    combustion chamber, resulting in flameout and engine shutdown
  </Option>
</Question>
```
