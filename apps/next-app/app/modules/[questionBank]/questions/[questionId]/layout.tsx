"use client";

import { useRouter } from "next/navigation";
import { default as RefreshOutlinedIcon } from "@mui/icons-material/RefreshOutlined";
import { default as VisibilityOutlinedIcon } from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Divider,
  Drawer,
  ModalClose,
  Sheet,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { getRandomIdGenerator } from "@cf/base/utils";
import { ModulesMain } from "@cf/next/ui";
import { useDisclose, useMediaQuery } from "@cf/react/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent, ReactNode } from "react";

export type QuestionPageProps = {
  explanation: ReactNode;
  question: ReactNode;
  params: {
    questionBank: QuestionBankName;
    questionId: string;
  };
};

const getRandomId = getRandomIdGenerator("seed");

const QuestionPage: FunctionComponent<QuestionPageProps> = ({
  params,
  explanation,
  question,
}) => {
  const metaDisclose = useDisclose();
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <ModulesMain fixedHeight sx={{ flexDirection: "row" }}>
      <Stack sx={{ flex: 1 }}>
        <Sheet
          sx={{
            p: 2,
            mx: "auto",
            maxWidth: "md",
            width: "100%",
            [theme.breakpoints.down("md")]: {
              all: "unset",
            },
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography level="h4">{params.questionId}</Typography>

            <Button
              variant="plain"
              children={"Shuffle"}
              sx={{ ml: "auto" }}
              endDecorator={<RefreshOutlinedIcon />}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("seed", getRandomId());
                router.replace(url.toString());
              }}
            />
            <Button
              variant="plain"
              children={"Meta"}
              sx={{ display: { lg: "none" } }}
              endDecorator={<VisibilityOutlinedIcon />}
              onClick={metaDisclose.open}
            />
          </Stack>

          <Divider orientation="horizontal" sx={{ my: 1 }} />
          {question}
        </Sheet>
      </Stack>

      <Divider
        orientation="vertical"
        sx={{
          display: { xs: "none", lg: "flex" },
          mx: 2,
        }}
      />

      <Stack
        sx={{
          flex: 1,
          position: "relative",
          display: { xs: "none", lg: "flex" },
        }}
      >
        <Box
          sx={{
            filter: metaDisclose.isOpen ? undefined : "blur(16px)",
            heihgt: "100%",
            overflowY: "auto",
          }}
        >
          <Stack sx={{ mx: "auto", maxWidth: "md" }}>{explanation}</Stack>
        </Box>
        {!metaDisclose.isOpen && (
          <Button
            variant="plain"
            aria-label="delete"
            size="lg"
            onClick={metaDisclose.open}
            color="neutral"
            hidden={metaDisclose.isOpen}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",

              "&:hover": {
                backgroundColor: "initial",
                color: "neutral",
              },
            }}
          >
            <VisibilityOutlinedIcon
              sx={{ fontSize: "4rem", color: "neutral" }}
            />
            <Typography fontSize={"1.75rem"} color="neutral">
              Reveal Explanation, Comments, and more...
            </Typography>
          </Button>
        )}
      </Stack>
      {isSmall && (
        <Drawer
          open={metaDisclose.isOpen}
          onClose={metaDisclose.close}
          anchor="right"
          size="lg"
        >
          <Stack
            direction="row"
            sx={{
              width: "100%",
              height: 40,
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderBottomColor: "divider",
              p: 1,
            }}
          >
            <Typography level="h4">{params.questionId}</Typography>
            <ModalClose sx={{ position: "initial" }} />
          </Stack>
          <Stack
            sx={{ p: 1, mx: "auto", flex: 1, overflowY: "auto", width: "100%" }}
          >
            {explanation}
          </Stack>
        </Drawer>
      )}
    </ModulesMain>
  );
};

export default QuestionPage;
