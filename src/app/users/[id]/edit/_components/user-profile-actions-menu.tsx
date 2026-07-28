"use client";
import { toggleUserBlock } from "@/app/users/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, SquarePen } from "lucide-react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const UserProfileActionsMenu = ({
  userId,
  loginUserId,
  initialIsBlocking,
}: {
  userId: string;
  loginUserId: number;
  initialIsBlocking: boolean;
}) => {
  const [isBlocking, setIsBlocking] = useState<boolean>(initialIsBlocking);
  const [busy, setBusy] = useState<boolean>(false);

  const handleToggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await toggleUserBlock(userId, isBlocking);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      setIsBlocking(result.blocking);
      toast.success(`${result.blocking ? "ブロックしました" : "ブロックを解除しました"}`, { position: "top-center" });
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Ellipsis className="text-muted-foreground/30 hover:text-muted-foreground cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Number(userId) === loginUserId ? (
          <Link href={`/users/${userId}/edit`}>
            <DropdownMenuItem>
              <SquarePen />
              プロフィール編集
            </DropdownMenuItem>
          </Link>
        ) : (
          <DropdownMenuItem onClick={handleToggle} disabled={busy}>
            {isBlocking ? "ブロック解除" : "ブロック"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileActionsMenu;
