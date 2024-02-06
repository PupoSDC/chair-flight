---
id: "062.02.04.01"
parent: "062.02.04"
title: Principles
---

````tsx
<Question id="OA6QPAXLG0" id="0UZ8BqmDuM" lo={["062.02.04.01.04"]}>
  <Text variant="oneCorrect">
    You are about to pass overhead a DME station at FL300 with a true ground
    speed of 300kt.${subject} What would your DME instrument read?
  </Text>
  <Text variant="oneCorrect">
    An aircraft at FL300 in ISA conditions with a ground speed of 300 NM is
    about to pass over a DME station.${subject} overhead position, What would
    the DME instrument read?
  </Text>
  <Option id="0UZ8BqmDuM-1" subject={[["One minute before the"]]}>
    less than 300kt and 7 NM
  </Option>
  <Option id="0UZ8BqmDuM-2" subject="At the">
    less than 300kt and 5 NM
  </Option>
  <Option id="0UZ8BqmDuM-3">more than 300kt and 7 NM</Option>
  <Option id="0UZ8BqmDuM-4">more than 300kt and 5 NM</Option>
  <Option id="0UZ8BqmDuM-5">300kt and 7 NM</Option>
  <Option id="0UZ8BqmDuM-6">300kt and 5 NM</Option>

  <Explanation subject={[["One minute before the"]]}>
    When 1 minute before the overhead position you would be 30 000 ft above the
    DME but also `5NM` away on the horizontal plane. ``` 30 000 / 6074 = 5 5N
    sqrt(5^2 + 5^2) = 7 NM ``` Since the DME measures the speed of your aircraft
    based on a slant range, it will always under read your ground speed.
  </Explanation>

  <Explanation subject={[["At the"]]}>
    When directly above the overhead position you would be 30 000 ft away from
    the DME. `30 000 / 6074 = 5 NM`. Since the DME measures the speed of your
    aircraft based on a slant range, it will always under read your ground
    speed.
  </Explanation>
</Question>
````
