import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SyncStatusIndicator } from "@/design/components/sync-status-indicator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SyncStatusIndicator />
      </body>
    </html>
  );
}
