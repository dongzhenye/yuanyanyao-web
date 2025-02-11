import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from 'next-seo'
import { defaultSEO } from '@/lib/seo'
import { GoogleAnalytics } from '@next/third-parties/google'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSEO} />
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-EMRFBV0NL0" />
    </>
  );
}
