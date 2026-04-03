import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmiGreat — Sign in",
  description: "Citizenship prep and settlement tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
