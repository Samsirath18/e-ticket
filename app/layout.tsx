import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "GO-TICKET",
  description: "Plateforme de vente de tickets au Benin",
  icons: {
    icon: "/GO-ticket.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-black text-white antialiased">
        <Navbar />
        <div className="pt-32">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
