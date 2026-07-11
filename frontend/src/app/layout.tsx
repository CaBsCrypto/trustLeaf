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
  title: "TrustLeaf — Medicinal Cannabis Trust Standard",
  description:
    "Public traceability, private identity. Cannabis medicinal con blockchain.",
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
