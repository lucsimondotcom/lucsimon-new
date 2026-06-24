import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import { ThemeVars } from "@/components/ThemeVars";
import { CRITICAL_LOADER_CSS } from "@/lib/criticalLoaderCss";
import "./globals.css";

const neueHaasRoman = localFont({
  src: "../../public/fonts/NeueHaasDisplay-Roman.woff2",
  variable: "--font-neue-haas-roman",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Arial",
});

const neueHaasMedium = localFont({
  src: "../../public/fonts/NeueHaasDisplay-Mediu.woff2",
  variable: "--font-neue-haas-medium",
  weight: "500",
  display: "swap",
  adjustFontFallback: "Arial",
});

const safiroRegular = localFont({
  src: "../../public/fonts/safiro-regular.woff2",
  variable: "--font-safiro-regular",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const safiroItalic = localFont({
  src: "../../public/fonts/safiro-regular-i.woff2",
  variable: "--font-safiro-italic",
  weight: "400",
  style: "italic",
  display: "swap",
  adjustFontFallback: "Times New Roman",
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
      className={`${neueHaasRoman.variable} ${neueHaasMedium.variable} ${safiroRegular.variable} ${safiroItalic.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeVars />
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_LOADER_CSS }} />
      </head>
      <body className="site-preparing min-h-full" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
