import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  preload: false,
});

const mPlusRounded = M_PLUS_Rounded_1c({
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Oshi Graphy | 推しグラフィー",
  description: "おとなの推し活を記憶し、感動を共有しよう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${poppins.variable} ${mPlusRounded.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex flex-col flex-1">
          <TooltipProvider>{children}</TooltipProvider>
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
