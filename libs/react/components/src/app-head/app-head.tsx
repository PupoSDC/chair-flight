import { default as Head } from "next/head";
import type { FunctionComponent } from "react";

export const APP_NAME = "Chair Flight";

export const APP_DESC = [
  "Chair Flight is a community driven Aviation Question Bank built by students",
  "for students. Prepare yourself for your ATPL exams, Interviews, and type",
  "rating technical exams. For Free!",
].join(" ");

export const BASE_URL = "http://chair-flight.com";

export type AppHtmlHeadProps = {
  title?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkImage?: string;
};

export const AppHead: FunctionComponent<AppHtmlHeadProps> = ({
  title = APP_NAME,
  linkTitle = APP_NAME,
  linkDescription = APP_DESC,
  linkImage = `/images/background-article.png`,
}) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={linkDescription} key="dec" />
    <meta property="og:title" content={linkTitle} key="title" />
    <meta property="og:image" content={`${BASE_URL}${linkImage}`} />
    <meta property="og:description" content={linkDescription} />
    <meta property="twitter:title" content={linkTitle} />
    <meta property="twitter:image" content={`${BASE_URL}${linkImage}`} />
    <meta property="twitter:description" content={linkDescription} />
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <meta name="msapplication-TileColor" content={"#000"} />
    <link rel="shortcut icon" href="favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </Head>
);
