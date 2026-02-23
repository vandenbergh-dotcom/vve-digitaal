import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VvE Digitaal - Slimme VvE Beheer met AI",
  description: "De slimste VvE beheerder is geen persoon, maar een platform. AI-gestuurde VvE beheer voor garageboxen, opslagruimtes en appartementen.",
  openGraph: {
    title: "VvE Digitaal - Slimme VvE Beheer met AI",
    description: "AI-gestuurde VvE beheer voor garageboxen, opslagruimtes en appartementen. Digitaal stemmen, financieel overzicht, MJOP en meer.",
    type: "website",
    locale: "nl_NL",
    siteName: "VvE Digitaal",
  },
  twitter: {
    card: "summary_large_image",
    title: "VvE Digitaal - Slimme VvE Beheer met AI",
    description: "AI-gestuurde VvE beheer voor garageboxen, opslagruimtes en appartementen.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
