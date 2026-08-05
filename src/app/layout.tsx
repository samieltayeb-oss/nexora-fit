import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";

const fontDisplay = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fontBody = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const fontMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

import { SyncStatusIndicator } from "@/design/components/sync-status-indicator";
import "./globals.css";

export const viewport = {
  themeColor: "#14b8a6",
};

export const metadata: Metadata = {
  title: "Nexora Health",
  description: "Stronger Heart. Better Health. Sustainable Progress.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nexora Health",
  },
  openGraph: {
    title: "Nexora Health",
    description: "Stronger Heart. Better Health. Sustainable Progress.",
    url: "https://health.nexora.ai",
    siteName: "Nexora Health",
    type: "website",
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
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        {children}
        <SyncStatusIndicator />
      </body>
    </html>
  );
}
