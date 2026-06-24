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
} from "@/components/ui/pagination";

// ページネーションコンポーネントに渡すプロパティの型定義
// currentPage: 現在表示中のページ番号
// lastPage: 最後のページ番号（総ページ数）
type DiaryPaginationProps = {
  currentPage: number;
  lastPage: number;
};

const DiaryPagination = ({ currentPage, lastPage }: DiaryPaginationProps) => {
  // 画面に表示するページ番号のリスト（最大3件）
  // 初期値は [1, 2, 3]
  const [displayPages, setDisplayPages] = useState<number[]>(
    Array.from({ length: 3 }, (_, i) => i + 1),
  );

  // 「次へ」ボタンを押したとき、表示ページ番号を1つ繰り上げる
  // 例: [1, 2, 3] → [2, 3, 4]
  // ただし、現在地が表示リストの末尾でない場合や、すでに最終ページの場合は何もしない
  const handleDisplayPagesUp = () => {
    const lastPagination = displayPages.at(-1);
    if (currentPage !== lastPagination) return;
    if (lastPagination! >= lastPage) return;
    const newDisplayPages = displayPages.map((dp) => dp + 1);
    setDisplayPages(newDisplayPages);
  };

  // 「前へ」ボタンを押したとき、表示ページ番号を1つ繰り下げる
  // 例: [2, 3, 4] → [1, 2, 3]
  // ただし、すでに先頭（1ページ目）が表示されている場合は何もしない
  const handleDisplayPagesDown = () => {
    const firstPagination = displayPages.at(0);
    if (firstPagination === 1) return;
    const newDisplayPages = displayPages.map((dp) => dp - 1);
    setDisplayPages(newDisplayPages);
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* 「前へ」ボタン：1ページ目のときはリンク先を "#" にして非活性表示 */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? "#" : `?page=${currentPage - 1}`}
            onClick={handleDisplayPagesDown}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* 表示リストの先頭が1でない場合、左側に「...」を表示 */}
        {displayPages.at(0) !== 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* ページ番号ボタンを表示する
            総ページ数が表示リスト件数以下の場合は全ページ分を、
            それ以外は displayPages のうち lastPage を超えないものを表示する */}
        {(lastPage <= displayPages.length
          ? Array.from({ length: lastPage }, (_, i) => i + 1)
          : displayPages.filter((p) => p <= lastPage)
        ).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={`?page=${p}`} isActive={currentPage === p}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 表示リストの末尾が最終ページでない場合、右側に「...」を表示 */}
        {lastPage > displayPages.length && lastPage !== displayPages.at(-1) && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 「次へ」ボタン：最終ページのときはリンク先を "#" にして非活性表示 */}
        <PaginationItem>
          <PaginationNext
            href={currentPage === lastPage ? "#" : `?page=${currentPage + 1}`}
            onClick={handleDisplayPagesUp}
            aria-disabled={currentPage === lastPage}
            className={currentPage === lastPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DiaryPagination;
