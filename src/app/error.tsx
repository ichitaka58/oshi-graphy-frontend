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
    <div>
      <p>予期しないエラーが発生しました</p>
      <button onClick={() => reset}>再試行</button>
    </div>
  );
}
