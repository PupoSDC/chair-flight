
import type { GetStaticProps, NextPage } from "next";
import { AppHead } from "../src/components/app-head";
import { AppHeader } from "../src/components/app-header";
import { Typical } from "../src/components/typical";
import { APP_DESC, APP_NAME } from "../src/constants/text";

const PUNCH_LINES = [
  "Community Built",
  2000,
  "Minimalistic",
  2000,
  "Free",
  2000,
];

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
      <main>
        <h1>
          Chair Flight is <br />
          <Typical steps={PUNCH_LINES} />
          &nbsp;
        </h1>

        <h3>Built by students for students.</h3>

        <div className="button-container">
          <a href="/questions" role="button">
            Explore Questions
          </a>
          <a href="/articles/about-us" role="button" className="outline">
            About This Project
          </a>
        </div>
      </main>
      <style jsx>{`
        main {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: calc(100% - var(--toolbar-height));
          width: 100%;
          background-color: var(--special-background);
          padding: 2em 1em 1em 1em;
        }

        h1 > :global(span) {
          color: var(--primary);
        }

        .button-container {
          position: absolute;
          display: flex;
          flex-direction: column;
          bottom: 1em;
          width: calc(100% - 2em);
        }

        .button-container a {
          margin-top: 0.5em;
        }

        :global(:root) {
          background-color: var(--special-background);
        }
      `}</style>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default IndexPage;
