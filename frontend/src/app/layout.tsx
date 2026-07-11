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
