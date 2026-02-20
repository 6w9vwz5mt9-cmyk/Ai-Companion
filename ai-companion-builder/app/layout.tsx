import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Companion Builder",
  description: "Create a safe, romantic AI companion—your virtual partner experience."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
