import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Cartas Contempladas | Busca de Consórcios Contemplados",
  description: "Encontre as melhores oportunidades de cartas de consórcio já contempladas. Compare preços de imóveis e veículos de múltiplos sites em um só lugar.",
  keywords: "cartas contempladas, consórcio, consórcio contemplado, carta de crédito, imóvel, veículo, comprar consórcio",
  authors: [{ name: "Cartas Contempladas" }],
  openGraph: {
    title: "Cartas Contempladas | Busca de Consórcios Contemplados",
    description: "Encontre as melhores oportunidades de cartas de consórcio já contempladas.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💳</text></svg>" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
