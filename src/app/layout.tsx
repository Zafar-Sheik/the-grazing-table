import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const script = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Grazing Table — Created to Serve",
  description:
    "Charcuterie cups, grazing boxes, grazing tables and mini desserts, curated by The Grazing Table in KwaZulu-Natal. Build your order and send it straight to WhatsApp.",
  openGraph: {
    title: "The Grazing Table — Created to Serve",
    description:
      "Charcuterie cups, grazing boxes, grazing tables and mini desserts.",
    images: ["/images/platter.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7eedf",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${jost.variable} ${script.variable} antialiased`}
    >
      <body className="grain min-h-full">{children}</body>
    </html>
  );
}
