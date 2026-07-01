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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DiaryActionsMenu = ({ id }: { id: string }) => {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    const result = await deleteDiary(id);
    if (result && !result.success) {
      toast.error(result.message, { position: "top-center" });
    }
    if (result && result.success) {
      toast.success(result.message, { position: "top-center" });
      router.push("/diaries");
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
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
    </>
  );
};

export default DiaryActionsMenu;
