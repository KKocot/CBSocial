"use client";
import { Session } from "next-auth";
import { FC, PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { getQueryClient } from "@/lib/react-query";

interface ProviderProps extends PropsWithChildren {
  session: Session | null;
}
export const Providers: FC<ProviderProps> = ({ children, session }) => {
  const queryClient = getQueryClient();
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
