"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをレポーティングサービスにログする
    console.error(error);
  }, [error]);
  
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <p className="text-destructive">予期しないエラーが発生しました</p>
      <button onClick={() => reset()} className="underline">再試行</button>
    </div>
  );
}
