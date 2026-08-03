"use client";

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
type AppPaginationProps = {
  currentPage: number;
  lastPage: number;
};

const AppPagination = ({ currentPage, lastPage }: AppPaginationProps) => {
  // 画面に表示するページ番号のリスト（最大3件）を currentPage/lastPage から毎回計算する。
  // stateで持ってボタン操作のたびに手動で更新する方式だと、直接URL遷移やブラウザの
  // 戻る/進むでcurrentPageが外部から変化したときに追従できず表示がズレるため、
  // 派生値として算出する方式に統一する。
  const windowSize = Math.min(3, lastPage);
  let windowStart = currentPage - windowSize + 1;
  windowStart = Math.max(1, windowStart);
  windowStart = Math.min(windowStart, lastPage - windowSize + 1);
  const displayPages = Array.from(
    { length: windowSize },
    (_, i) => windowStart + i,
  );

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* 「前へ」ボタン：1ページ目のときはリンク先を "#" にして非活性表示 */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? "#" : `?page=${currentPage - 1}`}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            text="前へ"
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
            aria-disabled={currentPage === lastPage}
            className={currentPage === lastPage ? "pointer-events-none opacity-50" : ""}
            text="次へ"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
