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

const CommentDeleteMenu = ({
  commentId,
  path,
}: {
  commentId: number;
  path: string;
}) => {
  const handleDelete = async () => {
    const result = await deleteComment(commentId, path);
    if (result && !result.success) {
      toast.error(result.message, { position: "top-center" });
      return;
    }
    if (result && result.success) {
      toast.success(result.message, { position: "top-center" });
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
