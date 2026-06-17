"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackToListButton = () => {
  const router = useRouter();
  const handleClick = () => {
    // 同一タブ内で一覧（例: /diaries?page=2）から遷移してきた場合は、
    // ブラウザバックで直前の URL へ戻る。これでページ番号もスクロール位置も
    // Next.js が自動復元する。
    // 直接アクセス等で履歴が無い場合は一覧トップへフォールバックする。
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/diaries");
    }
  }
  return (
    <button type="button" onClick={handleClick} aria-label="日記一覧へ戻る">
      <ChevronLeft />
    </button>
  );
}

export default BackToListButton;