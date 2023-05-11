import { default as Head } from "next/head";
import { APP_DESC, APP_NAME } from "../constants/text";
import type { FunctionComponent } from "react";

export type AppHtmlHeadProps = {
  title?: string;
  linkTitle?: string;
  description?: string;
  imageUrl?: string;
};

export const AppHead: FunctionComponent<AppHtmlHeadProps> = ({
  title = APP_NAME,
  linkTitle = APP_NAME,
  description = APP_DESC,
  imageUrl,
}) => (
  <Head>
    <title>{title}</title>
    <meta property="og:title" content={linkTitle} key="title" />
    <meta name="description" content={description} key="dec" />
    <meta property="og:description" content={description} key="desc2" />
    <meta property="og:image" content={imageUrl} key="image" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <meta name="msapplication-TileColor" content={"#000"} />
    <link rel="shortcut icon" href="favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </Head>
);
