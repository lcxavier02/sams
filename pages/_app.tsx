import "@/styles/globals.css";
import type { AppProps } from "next/app";

/**
 * App Component
 * 
 * This is the custom `App` component in a Next.js application. 
 * It serves as the root component that wraps all individual pages in the app, providing a global wrapper 
 * for any layout, state, or context that should persist across pages.
 * 
 * In this implementation, it simply renders the page component and its associated props.
 * 
 * @component
 * @param {AppProps} pageProps - Contains props specific to the page being rendered.
 * @returns {JSX.Element} - The rendered page component.
 */
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
