import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Budget Tracker",
  description: "A highly aesthetic personal finance dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden antialiased selection:bg-primary/20`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 relative">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-primary/10 via-transparent to-transparent -z-10 blur-3xl pointer-events-none" />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
