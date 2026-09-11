import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import TopBanner from "@/components/TopBanner";
import OfflineIndicator from "@/components/offline/OfflineIndicator";
import PWARegistry from "@/components/offline/PWARegistry";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "NAKSHATRA-X",
  description:
    "AI + satellite intelligence for manganese reserve mapping and production planning.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="preload" href="/frames/frame_0001.jpg" as="image" type="image/jpeg" fetchPriority="high" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${ibmMono.variable} bg-[var(--nx-void)] text-[var(--nx-ink)] antialiased`}
        suppressHydrationWarning
      >
        <PWARegistry />
        <TopBanner />
        {children}
        <OfflineIndicator />
      </body>
    </html>
  );
}

