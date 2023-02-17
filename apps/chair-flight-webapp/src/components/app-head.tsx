import { default as Head } from "next/head";
import { LOCAL_STORAGE_THEME } from "../constants/storage";
import type { FunctionComponent } from "react";

export type AppHtmlHeadProps = {
  title: string;
  linkTitle: string;
  description: string;
  imageUrl: string;
};

export const AppHead: FunctionComponent<AppHtmlHeadProps> = ({
  title,
  linkTitle,
  description,
  imageUrl,
}) => (
  <Head>
    <title>{title}</title>
    <meta property="og:title" content={linkTitle} key="title" />
    <meta name="description" content={description} key="dec" />
    <meta property="og:description" content={description} key="desc2" />
    <meta property="og:image" content={imageUrl} key="image" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <meta name="theme-color" content={"#000"} />
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
    <meta name="msapplication-TileColor" content={"#000"} />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="manifest" href="/site.webmanifest" />
    <link
      rel="apple-touch-icon"
      sizes="57x57"
      href="/icons/apple-icon-57x57.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="60x60"
      href="/icons/apple-icon-60x60.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="72x72"
      href="/icons/apple-icon-72x72.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="76x76"
      href="/icons/apple-icon-76x76.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="114x114"
      href="/icons/apple-icon-114x114.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="120x120"
      href="/icons/apple-icon-120x120.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="144x144"
      href="/icons/apple-icon-144x144.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href="/icons/apple-icon-152x152.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/icons/apple-icon-180x180.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="192x192"
      href="/icons/android-icon-192x192.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/icons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="96x96"
      href="/icons/favicon-96x96.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/icons/favicon-16x16.png"
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute("data-theme",  localStorage.getItem("${LOCAL_STORAGE_THEME}") || "light");`,
      }}
    />
  </Head>
);
