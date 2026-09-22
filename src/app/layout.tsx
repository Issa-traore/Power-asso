import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Power-asso — Créez le site de votre association",
  description: "La plateforme SaaS pour créer et personnaliser le site de votre association, avec abonnement en ligne.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
