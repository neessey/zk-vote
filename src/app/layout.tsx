import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

<Script
    src="https://unpkg.com/same-runtime/dist/index.global.js"
    strategy="beforeInteractive"
    crossOrigin="anonymous"
/>
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ZK-Vote - Plateforme de vote électronique sécurisée",
    description:
        "Votez de manière sécurisée et anonyme avec ZK-Vote, la plateforme utilisant les Zero-Knowledge Proofs",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>

            <body className="antialiased">
                <ClientBody>{children}</ClientBody>
            </body>
        </html>
    );
}
