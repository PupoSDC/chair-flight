import type { GetStaticProps, NextPage } from 'next';
import { AppHead } from '../src/components/app-head';
import { APP_DESC, APP_NAME } from '../src/constants/text';
import {
  AppHeader,
  HEADER_HEIGHT,
  Typical,
} from '@chair-flight/chair-flight-components';
import { default as Link } from '@mui/joy/Link';
import { Button, styled, Typography } from '@mui/joy';

const PUNCH_LINES = [
  'Community Built',
  2000,
  'Minimalistic',
  2000,
  'Free',
  2000,
];

const StyledMainContainer = styled('main')`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  padding: ${({ theme }) => theme.spacing(2, 2)};
  background-color: ${({ theme }) => theme.vars.palette.primary.softBg};

  h1 {
    font-weight: 900;
  }

  h1 > span {
    color: ${({ theme }) => theme.vars.palette.primary[500]};
  }
`;

const StyledLinksContainer = styled('div')`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 1em;
  width: calc(100% - 2em);

  & > a {
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
  & > a:hover {
    text-decoration: none;
  }
`;

const IndexPage: NextPage = () => {
  return (
    <>
      <AppHead
        title={APP_NAME}
        linkTitle={APP_NAME}
        description={APP_DESC}
        imageUrl={`${process.env.NEXT_PUBLIC_APP_URL}/images/HomeBackground.png`}
      />
      <AppHeader />
      <StyledMainContainer>
        <Typography level="h3" component="h1">
          Chair Flight is <br />
          <Typical steps={PUNCH_LINES} />
          &nbsp;
        </Typography>

        <h3>Built by students for students.</h3>

        <StyledLinksContainer>
          <Button
            size="lg"
            component={Link}
            href="/questions"
            children="Explore Questions"
          />
          <Button
            size="lg"
            variant="outlined"
            component={Link}
            href="/articles/about-us"
            children="About This Project"
          />
        </StyledLinksContainer>
      </StyledMainContainer>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default IndexPage;
