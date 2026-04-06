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
  title: "VvE App - Slim VvE beheer",
  description: "VvE beheer zonder gedoe. Facturen, betalingen, digitaal stemmen en meer. 90% goedkoper dan een professionele beheerder.",
  openGraph: {
    title: "VvE App - Slim VvE beheer",
    description: "VvE beheer zonder gedoe. Facturen, betalingen, digitaal stemmen. Voor garageboxen, opslagruimtes en appartementen.",
    type: "website",
    locale: "nl_NL",
    siteName: "VvE App",
  },
  twitter: {
    card: "summary_large_image",
    title: "VvE App - Slim VvE beheer",
    description: "VvE beheer zonder gedoe. 90% goedkoper dan een professionele beheerder.",
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
