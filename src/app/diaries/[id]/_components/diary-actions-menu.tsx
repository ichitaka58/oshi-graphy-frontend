"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";
import { deleteDiary } from "../../actions";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";
import { FullScreenLoadingOverlay } from "@/components/full-screen-loading-overlay";

const DiaryActionsMenu = ({ id }: { id: string }) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDiary(id);
      // TODO: オーバーレイの動作確認用。確認後に削除する
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // 成功時はdeleteDiary内でredirectされるため、ここに来るのは失敗時のみ
      toast.error(result.message, { position: "top-center" });
      // 失敗の時だけ、明示的にsetIsDeleting(false)する。成功時はredirectで画面遷移するのでstateを戻す必要がない
      setIsDeleting(false);
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
      setIsDeleting(false);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" aria-label="メニューを開く">
            <Ellipsis />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <Link href={`/diaries/${id}/edit`}>
              <DropdownMenuItem>
                <SquarePen />
                編集
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setAlertOpen(true)}
            >
              <Trash2 />
              削除
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 削除の確認AlertDialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>✅削除確認</AlertDialogTitle>
            <AlertDialogDescription>
              この日記を削除してよろしいですか？
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

      {/* 削除処理中のオーバーレイ */}
      {isDeleting && <FullScreenLoadingOverlay />}
    </>
  );
};

export default DiaryActionsMenu;
