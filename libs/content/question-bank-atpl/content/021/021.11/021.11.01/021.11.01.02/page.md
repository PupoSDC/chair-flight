---
id: "021.11.01.02"
parent: "021.11.01"
questionBank: "atpl"
title: Design, types and components of turbine engines
---

### Ideal turbine cycle

The ideal turbine cycle is known as Brayton cycle. All ideal cycles consist of 4
steps, usually in a cyclic sequence of Compression -> Combustion -> Expansion ->
Cooling.

![Brayton ideal cycle](images/021.11.01.2-02.png)

This ideal cycle is however drastically different from a real cycle.

- The cooling part of an ideal cycle does not really exist in a real engine.
  After the the expansion stage the air is released onto the atmosphere
- In the ideal Brayton cycle the energy used in the combustion is the same
  energy that is recouped by the cooling process.
- In the ideal Brayton cycle the only source of power results from the
  difference between the power required at the compressor and the power
  available in the turbine.

That being said, what makes the brayton cycle unique, and different from Diesel
and otto cycle, is that combustion is done at constant pressure (and not
constant volume).

### Free Power Turbine

> A free-turbine turboshaft is a form of turboshaft or turboprop gas turbine
> engine where the power is extracted from the exhaust stream of a gas turbine
> by an independent turbine, downstream of the gas turbine. The power turbine is
> not mechanically connected to the turbines that drive the compressors, hence
> the term "free", referring to the independence of the power output shaft (or
> spool). This is opposed to the power being extracted from the
> turbine/compressor shaft via a gearbox.

![Free Power turbine](images/021.11.01.2-01.png)

[Source](https://en.wikipedia.org/wiki/Free-turbine_turboshaft)

```tsx ignore
<Question id="EZZV2N5LJ0" lo="021.11.01.02.09">
  <Text variant="oneTwo">
    which statement is correct for a gas turbine engine with a constant speed
    propeller and free power turbine when the <Subject />?
  </Text>
  <Option subject={[["Power setting is increased"]]}>
    The gas generator speed increases
  </Option>
  <Option subject={[["Power setting is increased"]]}>The EGT increases</Option>
  <Option subject={[["Power setting is increased"]]}>
    The HP spool speed increases
  </Option>
  <Option subject={[["Power setting is decreased"]]}>
    The gas generator speed decreases
  </Option>
  <Option subject={[["Power setting is decreased"]]}>The EGT decreases</Option>
  <Option subject={[["Power setting is decreased"]]}>
    The HP spool speed decreases
  </Option>
  <Option subject={[["Propeller RPM setting is decreased"]]}>
    The Free Power turbine speed decreases
  </Option>
  <Option subject={[["Propeller RPM setting is increased"]]}>
    The Free Power turbine speed increases
  </Option>
  <Option
    subject={[
      ["Propeller RPM setting is decreased"],
      ["Propeller RPM setting is increased"],
    ]}
  >
    The gas generator speed remains constant
  </Option>
  <Option
    subject={[
      ["Propeller RPM setting is decreased"],
      ["Propeller RPM setting is increased"],
    ]}
  >
    The EGT remains constant
  </Option>
  <Option
    subject={[
      ["Propeller RPM setting is decreased"],
      ["Propeller RPM setting is increased"],
    ]}
  >
    The HP spool speed remains constant
  </Option>
  <Option
    subject={[["Power setting is increased"], ["Power setting is decreased"]]}
  >
    The Free Power turbine speed remains constant
  </Option>
  <Option
    subject={[
      ["Power setting is decreased"],
      ["Propeller RPM setting is increased"],
    ]}
  >
    The propeller blade angle decreases
  </Option>
  <Option
    subject={[
      ["Power setting is increased"],
      ["Propeller RPM setting is decreased"],
    ]}
  >
    The propeller blade angle increases
  </Option>

  <Explanation>
    ### Power related parameters * EGT, Gas generator speed, HP spool speed are
    all related to the current power level of the engine. * If power increases,
    all these values increase. If power decreases, all these values decrease. *
    Changing RPM has no effect in these parameters. ### RPM related parameters *
    Free power turbine speed is directly coupled with propeller speed. *
    Changing power has no effect in the free power turbine speed. * Increasing
    RPM directly increases Free power turbine speed. ### "Shared" parameters *
    Increasing power at constant RPM increases blade angle. * Increasing RPM at
    constant power decreases blade angle.
  </Explanation>
</Question>
```

```tsx ignore
<Question lo={["021.11.01.02.14"]} id="VUBWszQa">
  <Text variant="oneCorrect">
    How can Specific fuel consumption for a turbo-shaft engine be expressed?
  </Text>
  <Option id="VUBWszQa-1" correct>
    kg per Hour per unit of shaft power.
  </Option>

  <Option id="VUBWszQa-0"> Kg per Hour per NM.</Option>
  <Option id="VUBWszQa-2">Kg per unit of shaft power.</Option>
  <Option id="VUBWszQa-3">Kg per Hour per km.</Option>
</Question>
```
