import { Html, Head, Main, NextScript } from "next/document";

/**
 * Document Component
 * 
 * This is a custom Document component in Next.js. It is used to augment the default HTML document structure. 
 * This component is only rendered on the server side and is used to control the overall structure of the HTML document.
 * 
 * @component
 * @returns {JSX.Element} The HTML structure of the document.
 * 
 * @remarks
 * - The `Document` component is a special Next.js component that allows you to customize the default `<html>`, `<head>`, and `<body>` tags.
 * - This component is useful for including custom styles, fonts, or scripts that should be consistent across all pages.
 */
export default function Document(): JSX.Element {
  return (
    <Html lang="en">
      <Head>
        <title>SAMS</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
