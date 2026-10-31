"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { getUnreadConversationCount } from "@/app/messages/actions";

// Contextの箱に入れる中身の型。
// unreadConversationCount: 現在の未読会話件数
// refetch: サーバーに最新の未読件数を問い合わせて、箱の中身を更新する関数
type UnreadConversationCountContextValue = {
  unreadConversationCount: number;
  refetch: () => Promise<void>;
};

// 「箱」そのものを作る。まだ中身は入っていないので初期値はnull。
// Providerで包まれていない場所でuseContextされた場合、このnullが返る。
const UnreadConversationCountContext = createContext<UnreadConversationCountContextValue | null>(null);

// 箱に実際の値を詰めて、配下のコンポーネントに配る役目のコンポーネント。
// enabled: ログイン中かどうか。falseなら未読件数を取得しない(未ログインユーザーへの誤ったAPIアクセスを防ぐ)
// children: このProviderで包まれる中身(layout.tsxでHeaderとmainページ全体を包む)
export const UnreadConversationCountProvider = ({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) => {
  // 未読会話数そのものを保持するstate。これが「箱の中身」の実体。
  const [unreadConversationCount, setUnreadConversationCount] = useState<number>(0);

  // サーバーに最新の未読件数を聞きに行き、stateを更新する関数。
  // これが呼ばれるたびにunreadConversationCountが更新され、Contextを読んでいる
  // すべてのコンポーネント(HeaderUserMenuなど)が自動的に再描画される。
  const refetch = useCallback(async () => {
    if (!enabled) return; // 未ログインなら何もしない
    try {
      const result = await getUnreadConversationCount(); // サーバーアクションを呼び出し
      if (result.success) {
        setUnreadConversationCount(result.unreadCount); // 成功したら最新値でstateを更新
      }
    } catch (error) {
      // redirect()などNext.js内部の制御用エラーはそのまま投げ直す
      unstable_rethrow(error);
    }
  }, [enabled]);

  // コンポーネントが最初に画面に表示された瞬間(マウント時)に1回だけ実行され、
  // 初期値をサーバーから取得する。これがないとunreadConversationCountはずっと0のまま。
  useEffect(() => {
    refetch();
  }, [refetch]);

  // 箱(UnreadConversationCountContext)に { unreadConversationCount, refetch } を詰めて、
  // childrenに配る。これより内側のコンポーネントはuseUnreadConversationCount()で読み取れる。
  return (
    <UnreadConversationCountContext.Provider value={{ unreadConversationCount, refetch }}>
      {children}
    </UnreadConversationCountContext.Provider>
  );
};

// 箱の中身を取り出すためのカスタムフック。
// 各コンポーネントはこれを呼ぶだけで { unreadConversationCount, refetch } が手に入る。
export const useUnreadConversationCount = () => {
  const context = useContext(UnreadConversationCountContext);
  if (!context) {
    // Providerの外側で呼ばれた場合(箱が設置されていない場所で使われた場合)のガード
    throw new Error("useUnreadConversationCount must be used within UnreadConversationCountProvider");
  }
  return context;
};
