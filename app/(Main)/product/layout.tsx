import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse All Games | TepiGame",
  description: "Search and filter through all our available games. Instantly top up your favorite mobile and PC games on TepiGame.",
  openGraph: {
    title: "Browse All Games | TepiGame",
    description: "Search and filter through all our available games. Instantly top up your favorite mobile and PC games on TepiGame.",
    url: "https://tepigame.com/product",
  }
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
