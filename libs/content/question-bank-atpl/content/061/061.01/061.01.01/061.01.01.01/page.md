---
id: "061.01.01.01"
parent: "061.01.01"
questionBank: "atpl"
title: Form
---

### Earth's circumference

You have to remember 2 values: **40 000 km** and **21 600 NM**.

If you are not keen on memorizing values you should remember that at the equator
1 minute arc is 1 NM. With 60 minutes in a degree, and 360º, you get that

$$
60 \times 360 = 21600 minutes = 21600 NM
$$

You can then rough estimate `km` from this with the knowledge that
`1 NM = 1.852km` (you can get this value from your flight computer).

$$
21600 \times 1.852 = 40000 km
$$

```tsx
<Question
  id="W2UOXRL0RG"
  lo={["061.01.01.01.03"]}
  contentRef="### Earth's circumference"
>
  <Text variant="oneCorrect">
    What is, approximately. the circumference of the earth?
  </Text>
  <Option correct why="1 NM = 1 min arc. 60 * 360 = 21 600 = 40 000km">
    40 000 km
  </Option>
  <Option correct why="1 NM = 1 min arc. 60 * 360 = 21 600">
    21 600 NM
  </Option>

  <Option>40 000 NM</Option>
  <Option>21 600 km</Option>
  <Option>20 000 km</Option>
  <Option>20 000 NM</Option>
  <Option>80 000 km</Option>
  <Option>80 000 NM</Option>
  <Option>43 200 km</Option>
  <Option>43 200 NM</Option>
  <Option>15 800 km</Option>
  <Option>15 800 NM</Option>
</Question>
```
