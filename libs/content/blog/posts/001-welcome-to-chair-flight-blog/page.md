---
  title: Welcome to Chair Flight Blog!
  author: PupoSDC
  date: '2023-07-23'
  tag: Technical
  description: 
    This blog will be used to share technical improvements, new features, and
    other updates about Chair Flight. There will also be articles oriented to,
    make your journey as a flight student as smooth as possible.
---

This blog will be used to share technical improvements, new features, and
other updates about Chair Flight. There will also be articles oriented to make
your journey as a flight student as smooth as possible.

## What is Chair Flight?

Although the [About us](/articles/about-us) page is a good place to start, I'll
give you a more personalized version of what chair-flight aims to be.

During our ATPL studies, we had to go through several different ATPL theory
question banks and we noticed some patterns in all the existing banks:

- The banks were built based on student feedback, but then this knowledge was
  paywalled and exploited by the bank owners.
- The main metric for bank quality was question quantity, not quality. This
  resulted in a lot of repeated questions and questions that were not relevant
  to the ATPL exams.
- The primary focus of the banks was to get you to pass the exam and not to
  teach you the theory.
- The main focus when designing the banks' websites or apps was on protecting
  the questions from being "stolen", instead of providing a modern user experience.

Our goal is to create a platform that will help you to become a pilot. Our
distinguishing factor is that we aim to be a community built platform, where
students and instructors can share their knowledge and experience with others.

We aim to create a platform that is focused exclusively on UX and providing the
best environment for people to contribute with their own questions.

## How we make questions?

Our primary focus was on rethinking what a question is. Consider the following
classical question:

> Considering subsonic incompressible airflow through a Venturi, which statement is correct?
>
> - The dynamic pressure in the throat is lower than in the undisturbed airflow.
> - The total pressure in the throat is lower than in the undisturbed airflow.

This question is pretty common to this day in ATPL Principles of Flight exams.
However, it is a pretty dull question, that after you see once or twice, you will
never get it wrong.

The problem with this question is that it has 2 statements, each of them
writable in 3 different small variations that can be either correct or
incorrect. For this simple question, it's possible to write 18 variations!

That's 16 times more seeing this question than you really need to see it. In
Chair Flight, these question variants are combined into a single question:

```tsx eval
<QuestionOverview
  noSsr
  questionId={"QYFPA3CY4E"}
  questionBank="atpl"
  sx={{
    position: "relative",
    maxHeight: "620px",
    bgcolor: "background.surface",
    overflow: "auto",
    borderRadius: "8px",
    py: 1,
    my: 2,
  }}
/>
```

Feel free to spend some time playing around. You will notice all these possible
combinations of this one question8are collapsed into one. There is one shared
`Explanation` for all the variations, and on the `Variants` tab you can see all
the possible variations.

The advantage of this approach is that you will be able to flag this variant as
seen without having to go over all the possible variations. Alternatively, if
you struggle with this question, you can practice it as many times as you want,
without finding yourself "memorizing and moving on".

## What's next?

Chair Flight is still in its early stages, and we have a lot of work to do. Most
of our questions are still not grouped into variants, and most of them are lacking
explanations. We are also working on a new question editor that will allow you to
create questions and variants in a more intuitive way.

In the next few weeks we will be working on these features and publishing updates
in this blog as we go.
