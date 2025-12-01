import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/Providers"; // ✅ Import du Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INTELLECT BUILDING - Plateforme BTP",
  description: "Plateforme SaaS de gestion et formation dans le BTP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}