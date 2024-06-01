import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/next-auth";
import Navbar from "@/components/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Kingdom of Poland",
  description: "Counquerors Blade Kingdom of Poland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <ToastContainer />
          </ThemeProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
