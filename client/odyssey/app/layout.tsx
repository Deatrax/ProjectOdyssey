import type { Metadata } from "next";
import { Inter, Roboto_Mono, Playfair_Display, Manrope } from "next/font/google";

import "./globals.css";

// Load fonts with CSS variables
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Odyssey Travel App",
  description: "Plan your perfect trips with AI-powered itineraries",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} ${playfair.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
