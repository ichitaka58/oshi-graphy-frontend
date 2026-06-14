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


const DiaryActionsMenu = ({id}: {id: string}) => {
  const handleDelete = async() => {
    if(window.confirm("本当に削除しますか？")) {
      const result =await deleteDiary(id);
      if(result && !result.success) {
        alert(result.message);
      }
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Ellipsis className="text-muted-foreground" />
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
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 />
            削除
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DiaryActionsMenu;
