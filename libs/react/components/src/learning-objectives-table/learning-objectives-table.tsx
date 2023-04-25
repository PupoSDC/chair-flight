import { Box, Table, styled } from "@mui/joy";
import { LearningObjectivesTableRow } from "./learning-objectives-table-row";
import type { LearningObjectivesTableProps } from "./learning-objectives-table.types";
import type { FunctionComponent } from "react";

const StyledContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: `100%`,

  "& > table": {
    height: "calc(100% - 52px)",
  },

  "& table": {
    minWidth: 750,
  },

  [theme.breakpoints.down("sm")]: {
    "& th,td": {
      padding: theme.spacing(1),
    },
  },
}));

export const LearningObjectivesTable: FunctionComponent<
  LearningObjectivesTableProps
> = ({ learningObjectives }) => {
  return (
    <StyledContainer>
      <Table>
        <tbody>
          {learningObjectives.map((learningObjective) => (
            <LearningObjectivesTableRow
              key={learningObjective.id}
              {...learningObjective}
            />
          ))}
        </tbody>
      </Table>
    </StyledContainer>
  );
};
