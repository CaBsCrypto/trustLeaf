// Copyright © 2026 Browns Studio
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "../providers/WalletProvider";
import { QueryProvider } from "../providers/QueryProvider";
import { PrivyClientProvider } from "../providers/PrivyClientProvider";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustLeaf — Tu historial clínico, tuyo para siempre",
  description:
    "Tu historial clínico digital, privado y verificable. Recetas, vacunas y licencias médicas en blockchain.",
  openGraph: {
    title: "TrustLeaf — Tu historial clínico, tuyo para siempre",
    description:
      "Recetas verificadas en blockchain. Historial clínico digital. Control total del paciente.",
    url: "https://trustleaf-demo.vercel.app",
    siteName: "TrustLeaf",
    images: [
      {
        url: "https://trustleaf-demo.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrustLeaf — Historial Clínico Digital en Blockchain",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustLeaf — Tu historial clínico, tuyo para siempre",
    description:
      "Recetas verificadas en blockchain. Historial clínico digital.",
    images: ["https://trustleaf-demo.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <PrivyClientProvider>
          <QueryProvider>
            <WalletProvider>
              {children}
              <Toaster richColors position="top-right" />
            </WalletProvider>
          </QueryProvider>
        </PrivyClientProvider>
      </body>
    </html>
  );
}
