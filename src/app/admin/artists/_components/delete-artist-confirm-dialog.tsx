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
import { Trash2 } from "lucide-react";
import { deleteArtist } from "../actions";
import { unstable_rethrow, useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteArtistConfirmDialog = ({
  artistId,
  artistName,
}: {
  artistId: number;
  artistName: string;
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const result = await deleteArtist(String(artistId));
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      toast.success(result.message, { position: "top-center" });
      router.refresh();
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button">
          <Trash2 size={16} className="mx-auto" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>✅削除確認</AlertDialogTitle>
          <AlertDialogDescription>
            「{artistName}」を削除してもよろしいですか？
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

export default DeleteArtistConfirmDialog;
