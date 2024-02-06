import { useState } from "react";
import { default as Image } from "next/image";
import {
  Box,
  Link,
  ListItemContent,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { Ups, useDisclose } from "@chair-flight/react/components";
import type { AppRouterOutput } from "@chair-flight/trpc/server";
import type { FunctionComponent } from "react";

type SearchRouter = AppRouterOutput["common"]["search"];
type SearchResult = SearchRouter["searchAnnexes"]["items"][number];

export const AnnexSearchItem: FunctionComponent<{
  mobile?: boolean;
  result: SearchResult;
}> = ({ result, mobile }) => {
  const imagePreviewModal = useDisclose();
  const [error, setError] = useState(false);
  return (
    <>
      {mobile ? (
        <ListItemContent sx={{ display: "flex" }}>
          {error ? (
            <Ups
              sx={{
                flex: "initial",
                width: 100,
                height: 100,
                minHeight: 0,
                "& svg": {
                  width: 50,
                  height: 50,
                },
                "& h3": {
                  fontSize: "14px",
                },
              }}
              message="Not Found"
            />
          ) : (
            <Image
              src={result.href}
              alt=""
              width={100}
              height={100}
              onClick={imagePreviewModal.open}
              onError={() => setError(true)}
            />
          )}
          <Box sx={{ pl: 1 }}>
            <Typography level="h5" sx={{ fontSize: 14 }}>
              Questions
            </Typography>
            {result.questions.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                {id}
              </Link>
            ))}
            <Typography level="h5" sx={{ fontSize: 14 }}>
              Learning Objectives
            </Typography>
            {result.learningObjectives.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                {id}
              </Link>
            ))}
          </Box>
        </ListItemContent>
      ) : (
        <tr>
          <Box component="td" sx={{ height: "200px !important" }}>
            {error ? (
              <Ups
                sx={{
                  flex: "initial",
                  width: 200,
                  height: 200,
                  minHeight: 0,
                  "& svg": {
                    width: 100,
                    height: 100,
                  },
                  "& h3": {
                    fontSize: "18px",
                  },
                }}
                message="Not Found"
              />
            ) : (
              <Image
                onClick={imagePreviewModal.open}
                src={result.href}
                alt=""
                width={200}
                height={200}
                style={{ width: "auto", maxWidth: 270, height: "100%" }}
                onError={() => setError(true)}
              />
            )}
            <Box component="b" sx={{ fontSize: 12 }}>
              {result.id}
            </Box>
          </Box>
          <td>{result.description}</td>
          <td>{result.subjects.join(", ")}</td>
          <td>
            {result.learningObjectives.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ display: "block" }}>
                {id}
              </Link>
            ))}
          </td>
          <td>
            {result.questions.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ display: "block" }}>
                {id}
              </Link>
            ))}
          </td>
        </tr>
      )}
      <Modal open={imagePreviewModal.isOpen} onClose={imagePreviewModal.close}>
        <ModalDialog>
          <ModalClose variant="solid" />
          <Stack>
            <img
              src={result.href}
              alt=""
              style={{
                objectFit: "contain",
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "auto",
                height: "auto",
              }}
            />
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
};
