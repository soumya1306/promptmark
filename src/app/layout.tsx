import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terra - Modern Collaborative Document Editor",
  description: "A rich multiplayer collaborative writing workspace with Word-grade ribbon tools, real-time presence, track changes, and AI assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&family=Nunito+Sans:ital,opsz,wght@0,6..12,300..800;1,6..12,300..800&family=Inter:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full w-full overflow-hidden select-none bg-[#f4f1ea] text-[#2e3230] font-body">
        {children}
      </body>
    </html>
  );
}
