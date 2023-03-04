import { FunctionComponent } from 'react';
import { Box, BoxProps, styled } from '@mui/joy';

const StyledContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: `calc(100% - ${theme.shape.headerHeight}px)`,

  '& > .MuiTableContainer-root': {
    height: 'calc(100% - 52px)',
  },

  '& > .MuiTablePagination-root': {
    height: '52px',
  },

  '& table': {
    minWidth: 750,
  },

  [theme.breakpoints.down('sm')]: {
    '& th,td': {
      padding: theme.spacing(1),
    },
  },
}));

export type LearningObjectivesTableProps = {
  initialPageSize?: 5 | 10 | 25 | 50 | 100;
  initialIdFilter?: string;
  initialTextFilter?: string;
  initialCourseFilters?: string[];
  onCourseFiltersChanged?: (courses: string[]) => void;
  onIdFilterChanged?: (id: string) => void;
  courses: string[];
  learningObjectives: Array<{
    text: string;
    id: string;
    contentId: string;
    numberOfQuestions: number;
    courses: Record<string, boolean>;
  }>;
} & Pick<BoxProps, 'sx' | 'className'>;

export const LearningObjectivesTable: FunctionComponent<
  LearningObjectivesTableProps
> = () => {
  return <StyledContainer />;
};
