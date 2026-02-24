import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://dhyanfoundationguwahati.org"),
  title: {
    default: "Dhyan Foundation Guwahati — Save Cows in Assam",
    template: "%s | Dhyan Foundation Guwahati",
  },
  description:
    "Dhyan Foundation Guwahati rescues cows from illegal slaughter, runs a gaushala in Assam, and protects Nandis. Donate now — 80G tax benefit available.",
  keywords: [
    "dhyan foundation guwahati", "cow protection assam", "gaushala guwahati",
    "donate cows ngo india", "80g donation assam", "gau seva guwahati",
    "nandi protection assam", "cow shelter guwahati",
  ],
  authors: [{ name: "Dhyan Foundation Guwahati" }],
  openGraph: {
    type: "website",
    url: "https://dhyanfoundationguwahati.org",
    title: "Dhyan Foundation Guwahati — Save Cows in Assam",
    description: "Rescuing cows from brutality across Assam. Donate for 80G tax benefits.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    siteName: "Dhyan Foundation Guwahati",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhyan Foundation Guwahati",
    description: "Rescuing cows and Nandis across Assam. Donate with 80G tax benefit.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://dhyanfoundationguwahati.org" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "Dhyan Foundation Guwahati",
              url: "https://dhyanfoundationguwahati.org",
              description: "Cow protection NGO in Guwahati, Assam. Rescues cows from illegal slaughter.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Guwahati",
                addressRegion: "Assam",
                addressCountry: "IN",
              },
              email: "info@dhyanfoundation.com",
              telephone: "+91-9999567895",
              sameAs: ["https://dhyanfoundation.com"],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50 text-gray-800`}>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </SessionProvider>
      </body>
    </html>
  );
}
