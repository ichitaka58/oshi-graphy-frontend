import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { UnreadCountProvider } from "@/contexts/unread-count-context";
import { getCurrentUserOrNull } from "@/lib/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ログインユーザー情報をここで取得する(以前はHeaderが自分で取得していたが、
  // 下のUnreadCountProviderのenabledにも必要なため、共通の親であるここに引き上げた)
  const user = await getCurrentUserOrNull();
  return (
    <html
      lang="ja"
      className={`${poppins.variable} ${mPlusRounded.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        {/* HeaderとmainページをどちらもUnreadCountProviderで包むことで、
            両者が同じ未読件数の箱を共有できるようにする */}
        <UnreadCountProvider enabled={!!user}>
          <Header user={user} />
          <main className="flex flex-col flex-1">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
        </UnreadCountProvider>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
