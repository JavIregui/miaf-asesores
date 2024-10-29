import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIAF Asesores",
  description: "Noticias en materia tributaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#242C53" />
      </head>

      <body>
        {children}
      </body>
    </html>
  );
}
