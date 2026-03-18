import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Black Women Don't Get the Right Respect When It Comes to Our Skin | HerTone",
  description:
    "A personal essay on growing up Black, navigating an industry that was never built for melanin-rich skin, and finding a skincare system that finally sees you.",
  openGraph: {
    title:
      "Black Women Don't Get the Right Respect When It Comes to Our Skin",
    description:
      "A personal essay on growing up Black, navigating an industry that was never built for melanin-rich skin.",
    type: "article",
  },
};

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
