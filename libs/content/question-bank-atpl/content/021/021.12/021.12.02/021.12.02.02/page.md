---
id: "021.12.02.02"
parent: "021.12.02"
title: Fire detection
---

### Fire loop

```tsx
<Question id="90KFKR23NI" lo={["021.12.02.02.01"]}>
  <Text variant="oneCorrect">
    What happened when the a fire loop measures a <Subject />?
  </Text>
  <Option
    subject={[["low resistance and low capacity"]]}
    why="When temperature increases the loop resistance is supposed to decrease, and its capacitance is supposed to increase. If both of these decrease at the same time, the loop must be faulty."
  >
    The loop is faulty
  </Option>
  <Option subject={[["low resistance"], ["low capacity"]]}>
    The loop is detecting a potential fire.
  </Option>

  <Option>The loop is working normally in an idle state</Option>
  <Option>The loop is in test mode.</Option>
</Question>
```

```tsx
<Question lo={["021.12.02.02.04"]} id="YS1u4IAh">
  <Text variant="oneCorrect">
    If an engine fire detection loop is broken, what is the indication when the
    fire warning system is tested for that engine?
  </Text>
  <Option id="YS1u4IAh-0">A fault alert and a fire warning light.</Option>
  <Option id="YS1u4IAh-1">A fault alert and a fire warning bell.</Option>
  <Option id="YS1u4IAh-2">A fault alert and a red master warning light.</Option>

  <Option id="YS1u4IAh-3" correct>
    No indication or a fault alert.
  </Option>
</Question>
```
