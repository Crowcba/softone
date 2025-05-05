import './globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'SoftOne ERP',
  description: 'SoftOne - Sistema de Gestão Integrada para sua empresa',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo-text-on-dark.svg', type: 'image/svg+xml' },
    ],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
        <Script id="handle-body-attributes" strategy="afterInteractive">{`
          // Remover atributos que causam problemas de hidratação
          if (document.body.hasAttribute('__processed_d2583ae6-9c5c-487a-a2e7-3152fec69fef__')) {
            document.body.removeAttribute('__processed_d2583ae6-9c5c-487a-a2e7-3152fec69fef__');
          }
          if (document.body.hasAttribute('cz-shortcut-listen')) {
            document.body.removeAttribute('cz-shortcut-listen');
          }
          // Remover qualquer outro atributo __processed_ que possa ser criado dinamicamente
          Array.from(document.body.attributes).forEach(attr => {
            if (attr.name.startsWith('__processed_')) {
              document.body.removeAttribute(attr.name);
            }
          });
        `}</Script>
      </body>
    </html>
  );
}
