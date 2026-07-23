"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { User } from "@/types/user";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bell,
  BookHeart,
  LogOutIcon,
  Notebook,
  NotebookPen,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { useUnreadCount } from "@/contexts/unread-count-context";

const HeaderUserMenu = ({ user }: { user: User }) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  // propsではなくContextから未読件数を取得する。
  // どこかでrefetch()が呼ばれるとunreadCountが更新され、このコンポーネントも自動的に再描画される。
  const { unreadCount } = useUnreadCount();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        const result = await res.json();
        console.error(result.error);
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        toast.error(`ログアウトに失敗しました(${res.status})`, {
          position: "top-center",
        });
        return;
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("ログアウトに失敗しました");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user.icon_url} alt={`${user.name}icon`} />
              <AvatarFallback>OG</AvatarFallback>
              {unreadCount > 0 && <AvatarBadge className="bg-rose-600" />}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href="/diaries">
            <DropdownMenuItem>
              <BookHeart />
              自分の日記
            </DropdownMenuItem>
          </Link>
          <Link href="/public-diaries">
            <DropdownMenuItem>
              <Notebook />
              みんなの日記
            </DropdownMenuItem>
          </Link>
          <Link href="/diaries/create">
            <DropdownMenuItem>
              <NotebookPen />
              日記作成
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={"/notifications"}>
              <DropdownMenuItem>
                <Bell
                  className={`${unreadCount > 0 ? "text-rose-600" : ""}`}
                />
                <span>通知</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full text-center leading-5">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuItem>
            </Link>
            <Link href={`/users/${user.id}`}>
              <DropdownMenuItem>
                <UserIcon />
                プロフィール
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>
                <SettingsIcon />
                設定
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setAlertOpen(true)}
            >
              <LogOutIcon />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ログアウト確認ダイアログ */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              ログアウトしますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              ログアウト
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HeaderUserMenu;
