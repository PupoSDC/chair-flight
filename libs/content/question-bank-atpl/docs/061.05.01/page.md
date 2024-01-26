---
learningObjectiveId: "061.05.01"
parentId: "061.05"
title: Local Mean Time (LMT)
---

```tsx eval
<LearningObjectives learningObjectiveId={"061.05.01"} />
```

## Summary

### Mean solar day

Mean solar time is the hour angle of the mean Sun plus 12 hours. This 12 hour
offset comes from the decision to make each day start at midnight for civil
purposes, whereas the hour angle or the mean sun is measured from the local
meridian.

[Source: Wikipedia](https://en.wikipedia.org/wiki/Solar_time#Mean_solar_time)

### Local Mean Time

Local mean time is a form of solar time that corrects the variations of local
apparent time, forming a uniform time scale at a specific longitude. This
measurement of time was used for everyday use during the 19th century before
time zones were introduced beginning in the late 19th century; it still has some
uses in astronomy and navigation.

[Source: Wikipedia](https://en.wikipedia.org/wiki/Local_mean_time)

In simpler words: LMT is the mean time of the specific longitude you are
currently at. If you found yourself in Greenwish at 0º West during the winter,
the LMT would coincide with the time in your clock. But if you were to move 3º
West, the LMT would be $$3\deg / 15\deg \times 60 = 12 minutes$$ ahead of time
(your watch would indicate 12:00, but LMT is 12:12).

Local Mean time advances consitently with longitude at a rate of 15º per hour
(**remember** 360º = 24 hours).

```tsx
<Question id="3VBA5NI940" lo={["061.05.01.01.01"]} contentRef="### Local Mean Time">
  <Text variant="oneCorrect">
    At <Subject /> Local Mean Time of an observer...
  </Text>
<Option
  subject={[["0000"]]}
  why="The local mean time counts time from the anti-meridian. That is, hour 00:00 corresponds to the anti-meridian"
>
  The mean sun is in transit with the observer anti-meridian
</Option>
<Option
  subject={[["1200"]]}
  why="The local mean time counts time from the anti-meridian. As such, hour 12:00 corresponds to the meridian"
>
  The mean sun is in transit with the observer meridian
</Option>
<Option why="Local mean time awlays refers to the &#x22;mean sun&#x22;.">
  The apparent sun is in transit wit the observer anti-meridian
</Option>

  <Option why="Local mean time awlays refers to the &#x22;mean sun&#x22;.">
    The apparent sun is in transit wit the observer meridian
  </Option>
</Question>
```

```tsx
<Question id="3VBA5NI943" id="nhdaHnfa12" lo={['061.05.01.01.01', '061.05.02.01.01', '061.05.01.02.01']}>
  <Text variant="oneCorrect">
    When proceeding, on a given date, along a parallel towards the east, the moment of sunrise will
    occur one hour early every 15º deifference in logitutude whn time is expressed in...
  </Text>
<Option
  id="nhdaHnfa12-1"
  subject={[[]]}
  why="UTC does not change with a change in langitude: it's always the same. So if a point experiences sunrise at 08:00 UTC, a point 15º to the east will have eperiencied sunrise at 07:00 UTC."
>
  UTC
</Option>
<Option
  id="nhdaHnfa12-2"
  why="When dealing with Local Mean Time, at a given latitude for a given day, the sunset will alway be at the same time, regardless of where you are."
>
  LMT
</Option>
<Option
  id="nhdaHnfa12-3"
  why="When dealing with Local apparent time, at a given latitude, regardless of day, the sunset will always be at the same time, regardless of where you are."
>
  LAT
</Option>
<Option
  id="nhdaHnfa12-4"
  why="This answer is correct only withing some time zones. For example, if you are in Lisbon, and you move 15º towards the east, you will end up in Spain, where the sunrise will occour at the same time. This is true because portugal and Spain are in different time zones one hour appart. But if you are in the western part of china, and move the to the east, you will still be within the same time zone, and sunrise will occour one hour earlier. This is because china has a single time zone. As such this answer can't be considered correct."
>
  Standard Time
</Option>

  <Explanation>
    This question is basically trying to see if you understand that UTC is a global time
    that does not change with your position in the globe. 1500 UTC in China is 1500 UTC in great britain,
    independent of the local time and time zone that is observed.

    This means that if you are at a position where sunrise was observed at 18:00 UTC, 15º East sunrise
    was observed at 17:00.

    For all the other options this is either completely false, or not necessarily true.

  </Explanation>
</Question>
```
