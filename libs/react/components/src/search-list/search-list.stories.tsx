import { QuestionList } from "../question-list";
import * as QuestionListStories from "../question-list/question-list.stories";
import { SearchList } from "./search-list";
import type { Meta, StoryObj } from "@storybook/react";

export const QuestionListStory: StoryObj<typeof QuestionList> = {
  ...QuestionListStories.Playground,
  name: "QuestionList",
  args: QuestionListStories.default.args,
  render: (props) => <QuestionList {...props} />,
};

const meta: Meta<typeof SearchList> = {
  title: "Components/SearchList",
  component: SearchList,
  tags: ["autodocs"],
  argTypes: {
    renderThead: { control: false },
    renderListItemContent: { control: false },
    renderTableRow: { control: false },
  },
};

export default meta;
