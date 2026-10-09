"use client";

import { useEffect } from "react";
import { markConversationRead } from "../../actions";

// 画面には何も表示せず、スレッドを既読にするためだけのコンポーネント
const MarkAsRead = ({
  id,
  lastMessageId,
}: {
  id: number;
  lastMessageId?: number;
}) => {
  useEffect(() => {
    markConversationRead(id);
  }, [id, lastMessageId]);

  return null;
};

export default MarkAsRead;
