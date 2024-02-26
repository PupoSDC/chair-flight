import { useRouter } from "next/router";
import { Link, Typography } from "@mui/joy";
import { NotFoundError } from "@cf/base/errors";
import { Ups } from "@cf/react/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

export const TestError: FunctionComponent<{ error: Error }> = ({ error }) => {
  const router = useRouter();
  const questionBank = router.query["questionBank"] as QuestionBankName;

  const [errorMessage, color] = (() => {
    if (error instanceof NotFoundError) {
      return ["Test not found", undefined];
    }
    return ["Unexpected Error", "danger" as const];
  })();

  return (
    <Ups
      sx={{ height: "100%" }}
      color={color}
      message={errorMessage}
      children={
        <>
          <Typography>
            <Link href={"."} onClick={() => router.reload()}>
              Refresh
            </Link>
          </Typography>
          <Typography>
            or go to <Link href={`/modules/${questionBank}/tests`}>Tests</Link>
          </Typography>
        </>
      }
    />
  );
};
