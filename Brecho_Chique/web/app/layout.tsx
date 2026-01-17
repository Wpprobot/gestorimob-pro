import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: '--font-manrope',
  weight: ['400', '500', '700', '800']
});

export const metadata: Metadata = {
  title: "Chic Thrift - Luxo Sustentável",
  description: "Curadoria exclusiva de peças únicas de grandes marcas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${manrope.variable} font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col text-[#181113] dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
