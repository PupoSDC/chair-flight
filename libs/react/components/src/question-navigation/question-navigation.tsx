import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Button, Skeleton, styled } from "@mui/joy";
import { useWindowSize } from "../hooks/use-window-resize";
import type { BoxProps } from "@mui/joy";

const StyledBox = styled(Box)`
  --cell-width: ${({ theme }) => theme.spacing(4)};
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > ul {
    display: grid;
    width: 100%;
    padding: 0;
    margin: 0;
    grid-template-columns: repeat(auto-fill, minmax(var(--cell-width), 1fr));
    grid-gap: ${({ theme }) => theme.spacing(0.75)};
    list-style-type: none;
  }

  & > ul > li {
    width: 100%;
    height: var(--cell-width);
  }

  & > ul > li > button {
    width: 100%;
    height: var(--cell-width);
    min-width: var(--cell-width);
    min-height: var(--cell-width);
    padding: ${({ theme }) => theme.spacing(1)};
  }

  & > ul > li > button.active {
    border: 2px solid ${({ theme }) => theme.vars.palette.primary[500]};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  & > ul > li > button.active.MuiButton-variantSolid.MuiButton-colorPrimary {
    background-color: ${({ theme }) => theme.vars.palette.primary.solidHoverBg};
  }

  & > nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: ${({ theme }) => theme.spacing(2)};
  }

  & > nav > button {
    border-radius: 0;
    padding: ${({ theme }) => theme.spacing(0.5)};
    width: ${({ theme }) => theme.spacing(5)};
  }

  & > nav > button:not(:last-of-type) {
    border-right: 0;
  }

  & > nav > button:nth-of-type(3) {
    width: ${({ theme }) => theme.spacing(10)};
  }

  & > nav > button:first-of-type {
    border-top-left-radius: ${({ theme }) => theme.radius.md};
    border-bottom-left-radius: ${({ theme }) => theme.radius.md};
  }
  & > nav > button:last-of-type {
    border-top-right-radius: ${({ theme }) => theme.radius.md};
    border-bottom-right-radius: ${({ theme }) => theme.radius.md};
  }
`;

export type QuestionNavigationProps = {
  questions?: Array<{
    id: string;
    correctOption?: string;
    selectedOption?: string;
  }>;
  loading?: boolean;
  status?: "in-progress" | "show-result" | "both";
  currentId?: string;
  pageSize?: number;
  onQuestionClicked?: (id: string, index: number) => void;
  component?: React.ElementType;
} & Pick<BoxProps, "className" | "sx" | "style">;

export const QuestionNavigation = forwardRef<
  HTMLDivElement,
  QuestionNavigationProps
>(
  (
    {
      loading,
      questions = [],
      currentId = "",
      status = "in-progress",
      pageSize = 40,
      onQuestionClicked,
      ...boxProps
    },
    ref,
  ) => {
    const window = useWindowSize();
    const ulRef = useRef<HTMLUListElement>(null);
    const totalPages = Math.ceil(questions.length / pageSize);
    const currentQuestionIndex = Math.max(
      questions.findIndex((q) => q.id === currentId),
      0,
    );
    const currentQuestionPage = Math.floor(currentQuestionIndex / pageSize);
    const [currentPage, setCurrentPage] = useState(currentQuestionPage);
    const [height, setHeight] = useState(0);

    const updateHeight = useCallback(() => {
      if (!ulRef.current) return;
      const cellWidth = 32;
      const buttonHeight = 32;
      const width = ulRef.current.clientWidth;
      const columns = Math.max(0, Math.floor((width + 6) / (cellWidth + 6)));
      const rows = Math.ceil(pageSize / columns);
      const height = rows * (cellWidth + 6) + buttonHeight + 16;
      setHeight(height);
    }, [ulRef, setHeight, pageSize]);

    useLayoutEffect(updateHeight);
    useEffect(updateHeight, [updateHeight, window.width]);

    return (
      <StyledBox ref={ref} {...boxProps} style={{ height, ...boxProps.style }}>
        <Box component="ul" ref={ulRef}>
          {loading
            ? new Array(pageSize).fill(0).map((_, i) => (
                <Box component="li" key={i}>
                  <Button
                    disabled
                    variant={"outlined"}
                    color={"neutral"}
                    sx={{ p: "0 !important" }}
                    children={
                      <Skeleton
                        sx={{
                          width: "100%",
                          height: "var(--cell-width)",
                          borderRadius: 8,
                        }}
                      />
                    }
                  />
                </Box>
              ))
            : questions
                .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                .map((item, i) => {
                  const color = (() => {
                    if (status === "in-progress") {
                      return "neutral";
                    }
                    if (status === "both" && !item.selectedOption) {
                      return "neutral";
                    }
                    if (item.correctOption === item.selectedOption) {
                      return "success";
                    }
                    return "danger";
                  })();

                  return (
                    <Box component="li" key={item.id}>
                      <Button
                        onClick={() =>
                          onQuestionClicked?.(
                            item.id,
                            currentPage * pageSize + i,
                          )
                        }
                        variant={item.selectedOption ? "solid" : "outlined"}
                        color={color}
                        className={item.id === currentId ? "active" : ""}
                        children={currentPage * pageSize + i + 1}
                      />
                    </Box>
                  );
                })}
        </Box>
        {(loading || totalPages > 1) && (
          <Box component="nav">
            <Button
              variant="outlined"
              size="sm"
              color="neutral"
              disabled={loading || totalPages === 1}
              onClick={() => setCurrentPage(0)}
            >
              <KeyboardDoubleArrowLeftIcon />
            </Button>
            <Button
              variant="outlined"
              size="sm"
              color="neutral"
              disabled={loading || totalPages === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            >
              <KeyboardArrowLeftIcon />
            </Button>
            <Button
              variant="outlined"
              size="sm"
              color="neutral"
              disabled={loading || totalPages === 1}
              onClick={() => setCurrentPage(currentQuestionPage)}
            >
              {currentPage + 1} / {totalPages}
            </Button>
            <Button
              variant="outlined"
              size="sm"
              color="neutral"
              disabled={loading || totalPages === 1}
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
              }
            >
              <KeyboardArrowRightIcon />
            </Button>
            <Button
              variant="outlined"
              size="sm"
              color="neutral"
              disabled={loading || totalPages === 1}
              onClick={() => setCurrentPage(totalPages - 1)}
            >
              <KeyboardDoubleArrowRightIcon />
            </Button>
          </Box>
        )}
      </StyledBox>
    );
  },
);

QuestionNavigation.displayName = "TestQuestionNavigation";
