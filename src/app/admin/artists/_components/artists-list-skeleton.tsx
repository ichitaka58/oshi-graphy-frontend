import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ArtistsListSkeleton = () => {
  return (
    <Table className="table-fixed max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">No.</TableHead>
          <TableHead className="-auto whitespace-normal wrap-break-words">
            アーティスト名
          </TableHead>
          <TableHead className="w-auto">よみがな</TableHead>
          <TableHead className="w-11">編集</TableHead>
          <TableHead className="w-11">削除</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-xs">
        {Array.from({ length: 20 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-4 mx-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-4 mx-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArtistsListSkeleton;
