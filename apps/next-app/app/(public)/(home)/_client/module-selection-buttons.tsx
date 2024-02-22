"use client";

import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box } from "@mui/joy";
import { ModuleSelectionButton } from "@cf/react/components";
import { useThemeOverride } from "./theme-override";
import type { FunctionComponent } from "react";

export const ModuleSelectionButtons: FunctionComponent = () => {
  const questionBank = useThemeOverride((s) => s.questionBank);
  const setQuestionBank = useThemeOverride((s) => s.setQuestionBank);

  return (
    <Box>
      <ModuleSelectionButton
        fullWidth
        sx={{ mb: { xs: 1, md: 2 } }}
        color={"blue"}
        title={"ATPL theory"}
        description={[
          "Explore questions, learning objectives, and theory reviews ",
          "from the EASA QB ATPL exams.",
        ].join("")}
        active={questionBank === "atpl"}
        icon={<AirplaneTicketIcon />}
        onClick={() => setQuestionBank("atpl")}
        showMoreHref="/modules/atpl"
      />
      <ModuleSelectionButton
        fullWidth
        sx={{ mb: { xs: 1, md: 2 } }}
        color={"teal"}
        title={"Interview Prep"}
        description={[
          "Use our flash cards to practice answering open ended ",
          "questions and secure your first job.",
        ].join("")}
        active={questionBank === "prep"}
        icon={<StyleIcon />}
        onClick={() => setQuestionBank("prep")}
        showMoreHref="/modules/prep"
      />
      <ModuleSelectionButton
        fullWidth
        sx={{ mb: { xs: 1, md: 2 } }}
        color={"rose"}
        title={"Type Rating"}
        active={["type"].includes(questionBank ?? "")}
        description={[
          `Prepare or review your theory knowledge for a type rating `,
          `on the Boeing 737 or the Airbus A320. `,
        ].join("")}
        icon={<FlightTakeoffIcon />}
        onClick={() => setQuestionBank("type")}
        showMoreHref="/modules/type"
      />
    </Box>
  );
};
