"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { markAllRead } from "../actions";
import { toast } from "sonner";
import { unstable_rethrow } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MarkAllReadButton = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await markAllRead();
      if (!result.success) {
        setError(result.message);
        return;
      }
      toast.success("全ての通知を既読にしました", { position: "top-center" });
    } catch (error) {
      unstable_rethrow(error);
      setError("通信エラーが発生しました");
    }finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="xs"
              // onClick={handleClick}
              disabled={busy}
              className="cursor-pointer"
            >
              すべて既読にする
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>✅既読確認</AlertDialogTitle>
              <AlertDialogDescription>
                全ての通知を既読にしてよろしいですか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">
                キャンセル
              </AlertDialogCancel>
              <AlertDialogAction variant="default" onClick={handleClick}>
                既読にする
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {error && <p className="text-center text-red-500">{error}</p>}
    </>
  );
};

export default MarkAllReadButton;
