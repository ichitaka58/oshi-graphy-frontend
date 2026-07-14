"use client";

import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { deleteComment } from "./actions";
import { toast } from "sonner";
import { unstable_rethrow } from "next/navigation";
import { DiaryDetailPath } from "@/types/like";

const CommentDeleteMenu = ({
  commentId,
  path,
}: {
  commentId: number;
  path: DiaryDetailPath;
}) => {
  const handleDelete = async () => {
    try {
      const result = await deleteComment(commentId, path);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      toast.success(result.message, { position: "top-center" });
    } catch (error) {
      // deleteComment内のredirect("/login")はNext.jsがNEXT_REDIRECT例外を
      // throwすることで実現されている。ここで無条件にcatchすると
      // そのリダイレクト用の例外まで握りつぶしてしまうため、
      // redirect/notFound等の例外だけはunstable_rethrowで再送出しNext.jsに処理を戻す。
      unstable_rethrow(error);
      // ここに到達するのは本当の通信エラー等のみ
      toast.error("通信エラーが発生しました", { position: "top-center" });
    }
  };

  return (
    // 削除確認Dialog
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="opacity-0 group-hover:opacity-100 text-destructive/50">
          <Trash2 size={12} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>✅削除確認</AlertDialogTitle>
          <AlertDialogDescription>
            コメントを削除しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">キャンセル</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommentDeleteMenu;
