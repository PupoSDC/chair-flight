---
  title: Introducing Annex Search
  author: PupoSDC
  date: '2024-01-23'
  tag: Feature
  description: >
    Annexes are a center piece in all EASA exams. Finding them however, is not
    always easy. We are introducing annex search to Chair flight as an alternative
    way for you to find questions based on what annexes they included.
---

Annexes are a center piece in all EASA exams. Finding them however, is not
always easy. We are introducing annex search to Chair flight as an alternative
way for you to find questions based on what annexes they included.

```tsx eval
<AnnexSearch
  noSsr
  questionBank="atpl"
  forceMode="mobile"
  sx={{ height: 500, my: 2 }}
/>
```

Unfortunately, to make this work we had to change how we managed annexes
internally which will result in all your previously started and finished tests
no longer being available. Chair-flight is still in relatively early
development, and although we prefer to avoid such breaking changes, they will
sometimes are necessary.

- [Search ATPL Questions](/modules/atpl/annexes)
