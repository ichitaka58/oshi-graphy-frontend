"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Artist } from "@/types/artist";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import DeleteArtistConfirmDialog from "./delete-artist-confirm-dialog";

const ArtistsList = ({
  artists,
  from,
}: {
  artists: Artist[];
  from: number;
}) => {
  return (
    <Table className="table-fixed max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">No.</TableHead>
          <TableHead className="w-auto whitespace-normal wrap-break-words">
            アーティスト名
          </TableHead>
          <TableHead className="w-auto">よみがな</TableHead>
          <TableHead className="w-11">編集</TableHead>
          <TableHead className="w-11">削除</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-xs">
        {artists.map((a, index) => (
          <TableRow key={a.id}>
            <TableCell>{from + index}</TableCell>
            <TableCell className="whitespace-normal wrap-break-words">
              {a.name}
            </TableCell>
            <TableCell className="whitespace-normal wrap-break-words">
              {a.kana}
            </TableCell>
            <TableCell className="text-muted-foreground/70 cursor-pointer">
              <Link href={`/admin/artists/${a.id}/edit`}>
                <SquarePen size={16} className="mx-auto" />
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground/70 cursor-pointer">
              <DeleteArtistConfirmDialog artistId={a.id} artistName={a.name} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArtistsList;
