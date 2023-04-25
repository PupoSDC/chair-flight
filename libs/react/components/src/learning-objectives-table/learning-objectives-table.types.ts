import type { BoxProps } from "@mui/joy";

export type LearningObjectivesTableRowProps = {
  text: string;
  id: string;
  contentId: string;
  courses: Record<string, boolean>;
  courseList: string[];
  numberOfQuestions?: number;
  contentUrl?: string;
  questionsUrl?: string;
};

export type LearningObjectivesTableProps = {
  initialPageSize?: 5 | 10 | 25 | 50 | 100;
  initialIdFilter?: string;
  initialTextFilter?: string;
  initialCourseFilters?: string[];
  onCourseFiltersChanged?: (courses: string[]) => void;
  onIdFilterChanged?: (id: string) => void;
  courses: string[];
  learningObjectives: Array<LearningObjectivesTableRowProps>;
} & Pick<BoxProps, "sx" | "className">;
