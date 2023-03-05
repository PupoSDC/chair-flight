import type { GetStaticProps, NextPage } from 'next';
import { AppHead } from '../../src/components/app-head';
import { APP_DESC, APP_NAME } from '../../src/constants/text';
import {
  AppHeader,
  HEADER_HEIGHT,
} from '@chair-flight/chair-flight-components';
import { Input, styled } from '@mui/joy';
import { default as SearchIcon } from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from 'react';

const StyledMainContainer = styled('main')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  padding: 0 16px;
`;

const QuestionsIndexPage: NextPage = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.getElementsByTagName('input')[0].focus();
  }, []);

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
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 600, width: '100%', mt: 2 }}
          size="lg"
          placeholder="search Questions..."
          startDecorator={<SearchIcon />}
        />
      </StyledMainContainer>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default QuestionsIndexPage;
