"use client";

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
} from "@/components/ui/alert-dialog";
import { deleteNotification } from "../actions";
import { toast } from "sonner";
import { unstable_rethrow } from "next/navigation";

const NotificationDeleteDialog = ({ id }: { id: string }) => {
  // 通知の削除
  const handleDelete = async () => {
    try {
      const result = await deleteNotification(id);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      toast.success("通知を削除しました", { position: "top-center" });
    } catch (error) {
      // Next.js特有のエラー（redirectなど）を再throwする
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    }
  };

  return (
    // 削除確認Dialog
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className="cursor-pointer">
          削除
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>✅削除確認</AlertDialogTitle>
          <AlertDialogDescription>
            この通知を削除してよろしいですか？
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

export default NotificationDeleteDialog;
