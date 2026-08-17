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
import { UserProfileProvider } from "@/context/user-profile-context";
import "./globals.css";

export const viewport = {
  themeColor: "#14b8a6",
};

export const metadata: Metadata = {
  title: "NEXORA FIT — Executive Health Architecture",
  description: "Precision health management, clinical medication adherence & guided transformation.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NEXORA FIT",
  },
  openGraph: {
    title: "NEXORA FIT",
    description: "Precision health management & clinical fitness protocol.",
    url: "https://nexora-fit.vercel.app",
    siteName: "NEXORA FIT",
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
      <body className="min-h-full flex flex-col font-body bg-[#0a0a0f] text-foreground">
        <UserProfileProvider>
          {children}
          <SyncStatusIndicator />
        </UserProfileProvider>
      </body>
    </html>
  );
}

