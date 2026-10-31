"use client";

import { useEffect } from "react";
import { markConversationRead } from "../../actions";
import { useUnreadConversationCount } from "@/contexts/unread-conversation-count-context";

// 画面には何も表示せず、スレッドを既読にするためだけのコンポーネント
const MarkAsRead = ({
  id,
  lastMessageId,
}: {
  id: number;
  lastMessageId?: number;
}) => {
  // メニューの未読会話数を取り直す関数をContextから受け取る
  const { refetch } = useUnreadConversationCount();

  useEffect(() => {
    // 既読の保存が終わってから未読数を取り直す(.then)。
    // 同時に呼ぶと、保存前の古い未読数を取ってしまい、メニューの数字が減らないことがある。
    markConversationRead(id).then(() => refetch());
    // refetchはuseCallbackで固定されているので、依存配列に入れても余計に再実行されない
  }, [id, lastMessageId, refetch]);

  return null;
};

export default MarkAsRead;
