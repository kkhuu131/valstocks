import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/ui/nav-bar";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';

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

  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <head>
          <title>ValStocks</title>
          <meta name="description" content="Invest in your favorite VALORANT teams" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <ThemeProvider attribute="class" defaultTheme="dark">
                  <NavBar></NavBar>
                  {children}
                  <Toaster />
            </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
