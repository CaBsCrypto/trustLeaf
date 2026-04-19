import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "../providers/WalletProvider";
import { QueryProvider } from "../providers/QueryProvider";
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
        <QueryProvider>
          <WalletProvider>
            {children}
            <Toaster richColors position="top-right" />
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
