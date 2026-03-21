import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { MetaPixel } from "@/components/meta-pixel";

export const metadata: Metadata = {
  title: "DARK — Skincare for Melanin-Rich Skin",
  description: "A 3-serum system that fades hyperpigmentation in melanin-rich skin. Formulated for Fitzpatrick IV-VI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MetaPixel />
        {children}
        <Analytics />
      </body>
    </html>
  );
}