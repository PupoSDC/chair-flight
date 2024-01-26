---
learningObjectiveId: "021.03.01"
parentId: "021.03"
title: "Hydromechanics: basic principles"
---

```tsx eval
<LearningObjectives learningObjectiveId={"021.03.01"} />
```

## Summary

### Pressure

```js
P = F / A; // (N / m^2 => Pa)
```

In Aviation, it's typical to use PSI instead of the SI unit, Pascal.

### Pascal's law

> Pressure in an enclosed container is transmitted equally and undiminished to
> all parts of the container and acts at right angles to the enclosing walls.

Or, in simpler terms: you can assume that the pressure is constant in the entire
fluid. That includes the walls. For example:

```
    F1                             F2
 vvvvvvv                    vvvvvvvvvvvvvvv
|-------|                  |---------------|
|   A   |                  |      2A       |
|       |                  |               |
|       |__________________|               |
|                                          |
|__________________________________________|
```

At any surface you can assume that a constant P exists. So you if you know F1
you can calculate F2:

```js
P = F1 / A = F2 / (2 * A)

F2 = (2 * A * F1) / A => F2 = 2 * F1
```

### Pump Power

A pump deliver a certain mass flow (`m^3 / s`) with a certain Pressure
(`Pa => N / m^2`). Pump Power can be calculated by multiplying these two values:

```js
Power = m_flow * P; // `m^3 / s * N / m^2 => (N m) / s => W
```

<FunctionQuestion variant="calculation" lo="021.03.01.01.01">
  <Variables
    variables={{
    A: [10, 20, 40, 50],
    B: [5],
    C: [10, 20, 50, 100]
    }}
    answerFunction={(A, B, C) => `${A * B / C}N`}
  />

  <Text>
    knowing

    *   F1 = <A /> N
    *   A = <B /> N
    *   B = <C /> m^2

    ```
       F1                             F2
     vvvvvvv                    vvvvvvvvvvvvvvv
    |-------|                  |---------------|
    |   A   |                  |       B       |
    |       |                  |               |
    |       |__________________|               |
    |                                          |
    |__________________________________________|
    ```

  </Text>
</FunctionQuestion>
