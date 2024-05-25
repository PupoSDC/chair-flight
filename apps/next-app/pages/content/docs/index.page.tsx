import Image from "next/image";
import Favorite from "@mui/icons-material/Favorite";
import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { trpc } from "@cf/trpc/client";
import { ssrHandler } from "@cf/trpc/server";
import { LayoutPublic } from "../../_components/layout-public";
import type { NextPage } from "next";

const Page: NextPage = () => {
  const [{ docs }] = trpc.questionBank.docs.getTopLevelDocs.useSuspenseQuery();

  return (
    <LayoutPublic noPadding sx={{ main: { p: 2 } }}>
      <Grid container spacing={2}>
        {docs.map((doc) => (
          <Grid xs={12} sm={6} md={3} lg={2} key={doc.id}>
            <Card variant="outlined" sx={{ minHeight: 260 }}>
              <CardOverflow>
                <AspectRatio ratio="2">
                  <Image
                    src="/images/placeholders/test.png"
                    alt={"Cover Art for the document" + doc.title}
                    layout="fill"
                  />
                </AspectRatio>
                <IconButton
                  aria-label="Like minimal photography"
                  size="md"
                  variant="solid"
                  color="danger"
                  sx={{
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    right: "1rem",
                    bottom: 0,
                    transform: "translateY(50%)",
                  }}
                >
                  <Favorite />
                </IconButton>
              </CardOverflow>
              <CardContent
                component={Stack}
                justifyContent="center"
                alignItems="center"
                textAlign={"center"}
              >
                <Link href={doc.href} level="title-md" overlay underline="none">
                  {doc.title}
                </Link>
              </CardContent>
              <CardOverflow variant="soft">
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  <Typography level="body-xs">
                    {doc.docsContained} documents
                  </Typography>
                  <Divider orientation="vertical" />
                  <Typography level="body-xs">
                    {doc.questionBank.toUpperCase()}
                  </Typography>
                </CardContent>
              </CardOverflow>
            </Card>
          </Grid>
        ))}
      </Grid>
    </LayoutPublic>
  );
};

export const getServerSideProps = ssrHandler(async ({ params, helper }) => {
  await helper.questionBank.docs.getTopLevelDocs.fetch();

  return { props: params };
});

export default Page;
