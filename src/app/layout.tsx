import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/i18n";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://meetzap.app";

export const metadata: Metadata = {
  title: {
    default: "MeetZap - Find the Perfect Time to Meet",
    template: "%s | MeetZap",
  },
  description: "The easiest free scheduling tool for everyone. Create events, share links, and find the best meeting times with an interactive availability grid. No login required.",
  keywords: ["meeting scheduler", "scheduling tool", "availability", "free meeting planner", "group scheduling", "MeetZap", "find meeting time", "when2meet alternative"],
  authors: [{ name: "kasperzhang", url: "https://x.com/kasperzhang" }],
  creator: "kasperzhang",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MeetZap",
    title: "MeetZap - Find the Perfect Time to Meet",
    description: "The easiest free scheduling tool for everyone. Create events, share links, and find the best meeting times. No login required.",
  },
  twitter: {
    card: "summary",
    title: "MeetZap - Find the Perfect Time to Meet",
    description: "The easiest free scheduling tool for everyone. No login required.",
    creator: "@kasperzhang",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Header />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
