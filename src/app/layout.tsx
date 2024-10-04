import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLocale, getMessages } from "next-intl/server";

import { Providers } from "./providers";
import { NextIntlClientProvider } from "next-intl";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { rolesQueryOptions } from "@/queries/roles.query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQueryClient } from "@/lib/react-query";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "House management app",
  description: "Counquerors Blade app to house management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const queryClient = getQueryClient();
  await queryClient.ensureQueryData(rolesQueryOptions());
  const session = await getServerSession(authOptions);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className="grid grid-rows-[max-content_1fr_max-content] min-h-screen w-full">
        <NextIntlClientProvider messages={messages}>
          <Providers session={session}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Navbar />
              {children}
              <ToastContainer theme="colored" autoClose={2000} />
              <Footer />
            </HydrationBoundary>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
