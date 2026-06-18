import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center h-screen justify-center gap-4 mt-6 bg-zinc-50 font-sans dark:bg-black">
      <div>
        <Image
          src="/oshi-graphy-logo.png"
          alt="application-logo"
          width={200}
          height={200}
          priority
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-gray-800 dark:text-gray-300 mb-2 sm:mb-4 tracking-wider text-lg sm:text-2xl">
          推しグラフィー
        </h1>
        <p className="font-extrabold text-xl">
          <span className="block text-center">おとなの</span>
          <span className="block text-center">
            <span className="text-lg text-[#F8DE6F] text-shadow-sm text-shadow-gray-400">
              推し活
            </span>
            <span>を記憶し</span>
          </span>
          <span className="text-center">感動を共有しよう</span>
        </p>
        <p className="text-xs text-gray-800 dark:text-gray-300">
          ライブ参戦・写真・メモをまとめて管理。
          <br />
          思い出を美しく残そう。
        </p>
      </div>
      <div className="flex flex-col items-center gap-1 mt-4">
        <p className="text-sm">
          <Link href="/login" className="underline">ログイン</Link>
        </p>
        <p className="text-sm">
          新規登録は<Link href="/register" className="underline">こちら</Link>
        </p>
      </div>
    </div>
  );
}
