import { memo } from 'react';
import { LearningObjectivesTableRowProps } from './learning-objectives-table.types';
import { default as CheckIcon } from '@mui/icons-material/Check';
import { styled } from '@mui/joy';
import { useLinkComponent } from '../hooks/useLinkComponent';
import { default as ReactMarkdown } from 'react-markdown';
import { default as remarkGfm } from 'remark-gfm';

const StyledCourseCell = styled('td')<{ course: string }>`
  width: ${({ course }) => course.length * 12};
  text-align: center;
`;

const StyledIdCell = styled('td')`
  width: 100;
`;

const StyledContentLinkCell = styled('td')`
  align-content: center;
  max-width: 200;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledQuestionsLinkCell = styled('td')`
  align-content: center;
  text-align: center;
  max-width: 100;
`;

export const LearningObjectivesTableRow = memo<LearningObjectivesTableRowProps>(
  ({
    id,
    contentId,
    text,
    courseList,
    courses,
    contentUrl,
    questionsUrl,
    numberOfQuestions = 0,
  }) => {
    const { Link } = useLinkComponent();
    return (
      <tr tabIndex={-1}>
        <StyledIdCell>{id}</StyledIdCell>
        <td>
          <ReactMarkdown remarkPlugins={[remarkGfm]} children={text} />
        </td>
        {courseList.map((course) => (
          <StyledCourseCell key={course} course={course}>
            {courses[course] && <CheckIcon color="success" />}
          </StyledCourseCell>
        ))}
        {contentUrl && (
          <StyledContentLinkCell>
            <Link href={contentUrl}>{contentId}</Link>
          </StyledContentLinkCell>
        )}
        {questionsUrl && (
          <StyledQuestionsLinkCell>
            <Link href={questionsUrl}>{numberOfQuestions}</Link>
          </StyledQuestionsLinkCell>
        )}
      </tr>
    );
  }
);
