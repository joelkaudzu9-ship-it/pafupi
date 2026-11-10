import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./splash.css";
import "./auth.css";
import "./page-transition.css";
import "@/components/ui/button.css";
import "@/components/ui/skeleton.css";
import { Suspense } from "react";
import { SiteHeaderServer } from "@/components/site-header-server";
import PafupiSplash from "@/components/PafupiSplash";
import Toaster from "@/components/ui/toaster";
import ToastFlash from "@/components/ui/toast-flash";
import PageTransition from "@/components/page-transition";

export const metadata: Metadata = {
  title: {
    default: "Pafupi — Support is closer than you think",
    template: "%s | Pafupi",
  },
  description:
    "A space for mental wellbeing, understanding, human connection and support.",
  applicationName: "Pafupi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PAFUPI",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#172d35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PafupiSplash />
        <Suspense fallback={<div style={{ height: 64 }} />}>
          <SiteHeaderServer />
        </Suspense>
        <Suspense fallback={<div className="page-transition">{children}</div>}>
          <PageTransition>{children}</PageTransition>
        </Suspense>
        <ToastFlash />
        <Toaster />
      </body>
    </html>
  );
}