"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type DiaryPaginationProps = {
  currentPage: number;
  lastPage: number;
};

const DiariesPagination = ({ currentPage, lastPage }: DiaryPaginationProps) => {
  const [displayPages, setDisplayPages] = useState<number[]>(
    Array.from({ length: 3 }, (_, i) => i + 1),
  );

  const handleDisplayPagesUp = () => {
    const lastPagination = displayPages.at(-1);
    if (currentPage !== lastPagination) return;
    const newDisplayPages = displayPages.map((dp) => dp + 1);
    setDisplayPages(newDisplayPages);
  };

  const handleDisplayPagesDown = () => {
    const firstPagination = displayPages.at(0);
    if (firstPagination === 1) return;
    const newDisplayPages = displayPages.map((dp) => dp - 1);
    setDisplayPages(newDisplayPages);
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? "#" : `?page=${currentPage - 1}`}
            onClick={handleDisplayPagesDown}
          />
        </PaginationItem>
        {displayPages.at(0) !== 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {(lastPage <= displayPages.length
          ? Array.from({ length: lastPage }, (_, i) => i + 1)
          : displayPages
        ).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={`?page=${p}`} isActive={currentPage === p}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {lastPage > displayPages.length && lastPage !== displayPages.at(-1) && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage === lastPage ? "#" : `?page=${currentPage + 1}`}
            onClick={handleDisplayPagesUp}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DiariesPagination;
