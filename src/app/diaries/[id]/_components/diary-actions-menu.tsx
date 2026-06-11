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
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SquarePen />
            編集
          </DropdownMenuItem>
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
