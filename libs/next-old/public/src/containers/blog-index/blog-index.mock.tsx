import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["blog"]["getBlogIndex"] = {
  meta: [
    {
      title: "Adding an Issue report shortcut",
      filename: "008-issue-button",
      description:
        "In order to make it easier for you to report issues with Chair Flight, we  have added a new button in the top right corner to all our pages. With this  button, you can quickly report any issues you find.\n",
      author: "PupoSDC",
      date: "2024-01-27",
      imageUrl: null,
      tag: "Feature",
    },
    {
      title: "Introducing Annex Search",
      filename: "007-annex-search",
      description:
        "Annexes are a center piece in all EASA exams. Finding them however, is not always easy. We are introducing annex search to Chair flight as an alternative way for you to find questions based on what annexes they included.\n",
      author: "PupoSDC",
      date: "2024-01-23",
      imageUrl: null,
      tag: "Feature",
    },
    {
      title: "Improving Search",
      filename: "006-improving-search",
      description:
        "Finding questions on the Chair Flight Database has now become both faster and easier! We have added the ability to filter by subjects, learning objectives, as well as the ability to specify what exactly you are searching for.\n",
      author: "PupoSDC",
      date: "2024-01-20",
      imageUrl: null,
      tag: "Feature",
    },
    {
      title: "New A320 Question Bank!",
      filename: "005-new-a320-question-bank",
      description:
        "Today we are adding a new question bank to our application. This time we  are showing some love to all aspiring A320 pilots out there.\nThis question bank is based on the official Airbus A320 FCOM and it is available for free to all our users.\n",
      author: "PupoSDC",
      date: "2023-12-18",
      imageUrl: null,
      tag: "Content",
    },
    {
      title: "We refactored our Web App!",
      filename: "004-webapp-redesign",
      description:
        "In order to keep our focus we decided to restructure our application in three different segments. The main ovjective with this refactor is to allow students on each of the 3 stages of their aeronautical careers a customized experience without being distracted by contents that are not geared towards them.\n",
      author: "PupoSDC",
      date: "2023-11-17",
      imageUrl: null,
      tag: "Technical",
    },
    {
      title: "Introducing Our New 737 Type Rating Theory Question Bank",
      filename: "003-new-737-question-bank",
      description:
        "We are thrilled to announce the launch of our latest addition to the question bank family: the comprehensive 737 Type Rating Theory Question Bank.\nWith over 300 thoughtfully curated questions, this question bank is designed to challenge and enhance your understanding of the 737's systems, procedures, and aircraft limitations.\n",
      author: "PupoSDC",
      date: "2023-08-02",
      imageUrl: null,
      tag: "Content",
    },
    {
      title:
        "Helps us build the Chair Flight qestion bank with our new Question Editor",
      filename: "002-question-editor-release",
      description:
        "The key differential between our question bank and other solutions available is that our question bank is Free and Open source. The goal is to build a community of students and former students who wish to 'pay it forward' by helping us write and continuously review questions to make sure they are up to date.\nToday we are releasing one essential piece of the puzzle to make that happen.\n",
      author: "PupoSDC",
      date: "2023-07-29",
      imageUrl: null,
      tag: "Feature",
    },
    {
      title: "Welcome to Chair Flight Blog!",
      filename: "001-welcome-to-chair-flight-blog",
      description:
        "This blog will be used to share technical improvements, new features, and other updates about Chair Flight. There will also be articles oriented to, make your journey as a flight student as smooth as possible.",
      author: "PupoSDC",
      date: "2023-07-23",
      imageUrl: null,
      tag: "Technical",
    },
    {
      title: "About Us",
      filename: "000-about-us",
      description:
        "Our goal is to build an Open Source, Free and Community driven aviation question bank built by students for students.",
      author: "PupoSDC",
      date: "2023-07-01",
      imageUrl: null,
      tag: "Content",
    },
  ],
};
