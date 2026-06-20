import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import { ThemeVars } from "@/components/ThemeVars";
import { CRITICAL_LOADER_CSS } from "@/lib/criticalLoaderCss";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const safiroItalic = localFont({
  src: "../../public/fonts/safiro-regular-i.woff2",
  variable: "--font-safiro-italic",
  weight: "400",
  style: "italic",
  display: "swap",
});

const safiroRegular = localFont({
  src: "../../public/fonts/safiro-regular.woff2",
  variable: "--font-safiro-regular",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luc Simon — Product Engineer",
  description:
    "Je transforme la complexité numérique des PME en systèmes web clairs, fiables et performants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${safiroItalic.variable} ${safiroRegular.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeVars />
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_LOADER_CSS }} />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
