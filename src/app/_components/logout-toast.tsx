"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const LogoutToast = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shownRef = useRef(false);
  // →{ current: false }というただのオブジェクトが１つ作られ、shownRefという変数に入る
  // 状態管理だがstateと異なり値が変わっても再レンダーが起きない。

  useEffect(() => {
    if (searchParams.get("logged_out") !== "1") return;
    if (shownRef.current) return; // 初回実行falseなので通過、StrictModeによる2回目の実行trueのためreturn
    shownRef.current = true; // 即座にtrueに反映
    toast.success("ログアウトしました", { position: "top-center" });
    // 再読み込み時に再表示されないようクエリパラメータを消す
    router.replace("/");
  }, [searchParams, router]);
  return null;
};

export default LogoutToast;
