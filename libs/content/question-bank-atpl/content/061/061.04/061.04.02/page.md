---
id: "061.04.02"
parent: "061.04"
questionBank: "atpl"
title: Projections
---

|                   | Lambert                                            | Mercator                                            | Polar Stereographic         |
| ----------------- | -------------------------------------------------- | --------------------------------------------------- | --------------------------- |
|                   | ![Lambert Projection](images/061.04.02.02-01.jpeg) | ![Mercator Projection](images/061.04.02.03-01.jpeg) |                             |
| Projection type   | Conical                                            | Cylindrical                                         | Polar Stereographic         |
| Graticule         | Rectangular                                        | -                                                   |                             |
| Meridians         | Vertical straight lines                            | Polar Radial straight lines                         | Polar Radial straight lines |
| Parallels         | Horizontal straight lines                          | Polar Concentric arcs                               | Polar concentric circles    |
| Great Circles     | ![img](ping)                                       |                                                     |                             |
| Rhumb Lines       | Straight Lines                                     | Concave to the GC line <br /> Convex to the equator |                             |
| Chart Convergence | No convergence!                                    |                                                     | Constant across chart       |

```jsx
<Question
id="LXLE10O96T"
lo={["061.04.02.04.01", "061.04.02.03.01", "061.04.02.02.01"]}
contentRef="## Summary"

>   <Text variant="oneCorrect">

    Which of the following correctly describes a <Subject /> chart?

  </Text>
  <Option key="1" subject={[["Mercator"]]}>
    A cylindrical projection with the plane tangential to the equator
  </Option>
  <Option key="1" subject={[["Mercator"]]}>
    A cylindrical projection, but is in fact mathematically produced
  </Option>
  <Option key="1" subject={[["Mercator"]]}>
    A cylindrical projection, made using a single straight line which is tangent
    to the equator
  </Option>
  <Option subject={[["Lambert"]]}>
    A conical projection that "cust the earth" at two standard parallels.
  </Option>
  <Option why="Closely describes a Mercator projection, but A single straight line is used, not multiple">
    A cylindrical projection, made using straight lines which are tangent to the
    equator
  </Option>
  <Option why="Closely describes a Lambert projection, but two standard parallels are cut, not one.">
    A conical projection that "cust the earth" at a single standard parallel.
  </Option>
</Question>


<Question
id="3NQ0YN10CN"
lo={["061.04.02.04.01", "061.04.02.03.01", "061.04.02.02.01"]}
contentRef="## Summary"

>   <Text variant="oneCorrect">

    <Subject /> are...

  </Text>
  <Option subject={[["Parallels of latitude on a Direct Mercator Chart"]]}>
    Parallel straight lines unequally spaced
  </Option>
  <Option subject={[["Parallels of latitude on a Direct Mercator Chart"]]}>
    Parallel horizontal lines unequally spaced
  </Option>
  <Option subject={[["Parallels of latitude on a Conformal Lambert Chart"]]}>
    Parallel straight lines unequally spaced
  </Option>
  <Option subject={[["Meridians on a Conformal Lambert Chart"]]}>
    Parallel straight lines equally spaced
  </Option>
  <Option subject={[["Parallels on a Direct Mercator Chart"]]}>
    Concentric arcs with their center at the closest pole.
  </Option>
  <Option
    subject={[
      ["Meridians on a Direct Mercator Chart"],
      ["Meridians on a Polar Stereographic Chart"],
    ]}
  >
    Radial straight lines radiating from the closest pole.
  </Option>
  <Option subject={[["Parallels on a Polar Stereographic Chart"]]}>
    Concentric circles with their center at the closest pole.
  </Option>
</Question>
```
