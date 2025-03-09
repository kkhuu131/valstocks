"use client"

import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { StocksProvider } from "@/context/StocksContext";
import NavBar from "@/components/ui/nav-bar";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({  // ✅ Create in useState
    defaultOptions: {
      queries: {
        staleTime: 60000,
        gcTime: 120000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en">
      <head>
        <title>ValStocks</title>
        <meta name="description" content="Invest in your favorite VALORANT teams" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <StocksProvider>
              <UserProvider>
                <NavBar></NavBar>
                {children}
                <Toaster />
              </UserProvider>
            </StocksProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
