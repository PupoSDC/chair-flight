---
  title: Improving Search
  author: PupoSDC
  date: '2024-01-20'
  tag: Feature
  description: >
    Finding questions on the Chair Flight Database has now become both faster and
    easier! We have added the ability to filter by subjects, learning objectives, as
    well as the ability to specify what exactly you are searching for.
---

Finding questions on the Chair Flight Database has now become both faster and
easier! We have added the ability to filter by subjects, learning objectives, as
well as the ability to specify what exactly you are searching for.

<br />

Since Demos are worth 1000 pictures, have a go at the new question search for
the ATPL module right here:

```tsx eval
<SearchQuestions
  noSsr
  questionBank="atpl"
  forceMode="mobile"
  sx={{ height: 500, my: 2 }}
/>
```

- [Search ATPL Questions](/modules/atpl/questions)
- [Search ATPL Learning Objectives](/modules/atpl/learning-objectives)
- [Search Type Rating Questions](/modules/type/questions)
