import RootLayout from "@/layouts/RootLayout";
import Providers from "@/providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Inter, Space_Mono } from "next/font/google";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "auto",
});

const space = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "700"],
  display: "auto",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg" href="/mnmt.svg" />
      </Head>
      <main
        id="root-app"
        className={`${inter.variable} ${space.variable} font-sans`}
      >
        <Providers>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </Providers>
      </main>
    </>
  );
}
