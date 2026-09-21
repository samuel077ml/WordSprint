import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fichero",
  description: "Vocabulario en inglés organizado por temas de la vida real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
