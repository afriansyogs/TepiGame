import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TepiGame | The Fastest & Most Trusted Game Top-Up",
  description: "TepiGame - The fastest, cheapest, and most trusted platform to top up your favorite games instantly. Features a unique gamification system allowing you to exchange points for vouchers.",
  keywords: ["top up game", "game credits", "mobile legends diamond", "valorant points", "free fire diamonds", "genshin impact crystals", "pubg uc", "TepiGame", "cheap top up", "top up murah"],
  openGraph: {
    title: "TepiGame | Instant Game Top-Up",
    description: "TepiGame - The fastest, cheapest, and most trusted platform to top up your favorite games instantly. Play, earn points, and redeem vouchers!",
    url: "https://tepigame.com",
    siteName: "TepiGame",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TepiGame | Instant Game Top-Up",
    description: "The fastest, cheapest, and most trusted platform to top up your favorite games instantly.",
  },
  icons: {
    icon: "/tepi.svg",
    apple: "/tepi.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full overflow-x-hidden", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
