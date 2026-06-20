"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis, SquarePen } from "lucide-react";
import Link from "next/link";

const UserProfileActionsMenu = ({id}: {id: string}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Ellipsis className="text-muted-foreground/30 hover:text-muted-foreground cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/users/${id}/edit`}>
          <DropdownMenuItem>
            <SquarePen />
            編集
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserProfileActionsMenu;