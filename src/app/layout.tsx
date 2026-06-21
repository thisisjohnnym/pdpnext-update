import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const helveticaNeueLTPro = localFont({
  src: [
    {
      path: "./fonts/helvetica-neue-lt-pro-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/helvetica-neue-lt-pro-roman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/helvetica-neue-lt-pro-bold.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-coach",
  display: "swap",
});

const helveticaNeueLTProExtended = localFont({
  src: [
    {
      path: "./fonts/helvetica-neue-lt-pro-light-extended.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/helvetica-neue-lt-pro-extended.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/helvetica-neue-lt-pro-extended-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-coach-extended",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tabby 26 — Coach",
  description: "PDP — Tabby Shoulder Bag 26 product detail page",
};

// No `themeColor`: Safari 26 (iOS 26) ignores the meta tag and derives the
// toolbar color from fixed/sticky elements and the html/body background. Pre-26
// iOS used `theme-color`; structural CSS is now the source of truth.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${helveticaNeueLTPro.variable} ${helveticaNeueLTProExtended.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans text-neutral-900">
        {children}
      </body>
    </html>
  );
}
