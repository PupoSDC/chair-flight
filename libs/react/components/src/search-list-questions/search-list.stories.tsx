import { SearchList } from "./search-list";
import type { Meta } from "@storybook/react";

// TODO recover this demo....
// export const QuestionListStory: StoryObj<typeof QuestionList> = {
//   ...QuestionListStories.Playground,
//   name: "QuestionList",
//   args: QuestionListStories.default.args,
//   render: (props) => <QuestionList {...props} />,
// };

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
