import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MessageThread from "./message-thread";
import { Message } from "@/types/message";

const { getMoreMessagesMock, toastErrorMock } = vi.hoisted(() => ({
  getMoreMessagesMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock("../../actions", () => ({
  getMoreMessages: getMoreMessagesMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: toastErrorMock },
}));

const ME = 1;
const OTHER = 2;

function makeMessage(id: number, senderId: number, body: string): Message {
  return {
    id,
    conversation_id: 10,
    sender_id: senderId,
    body,
    created_at: "2026-10-31T10:00:00.000000Z",
    updated_at: "2026-10-31T10:00:00.000000Z",
  };
}

function renderThread(
  props: Partial<React.ComponentProps<typeof MessageThread>> = {},
) {
  return render(
    <MessageThread
      latestMessages={[]}
      currentUserId={ME}
      conversationId={10}
      lastPage={1}
      {...props}
    />,
  );
}

// 画面に並んでいる順にメッセージ本文を取り出す
function bodiesInOrder() {
  return screen
    .getAllByRole("listitem")
    .map((li) => within(li).getByText(/^メッセージ/).textContent);
}

describe("MessageThread", () => {
  beforeEach(() => {
    getMoreMessagesMock.mockReset();
    toastErrorMock.mockClear();
  });

  describe("表示", () => {
    it("メッセージが無い場合はその旨を表示する", () => {
      renderThread();

      expect(screen.getByText("メッセージがありません")).toBeInTheDocument();
    });

    it("APIの新しい順を古い順に並べ替えて表示する", () => {
      renderThread({
        latestMessages: [
          makeMessage(3, ME, "メッセージ3"),
          makeMessage(2, OTHER, "メッセージ2"),
          makeMessage(1, ME, "メッセージ1"),
        ],
      });

      expect(bodiesInOrder()).toEqual([
        "メッセージ1",
        "メッセージ2",
        "メッセージ3",
      ]);
    });

    it("自分のメッセージは右、相手のメッセージは左に寄せ、ラベルを付ける", () => {
      renderThread({
        latestMessages: [
          makeMessage(2, OTHER, "メッセージ相手"),
          makeMessage(1, ME, "メッセージ自分"),
        ],
      });

      const [mine, theirs] = screen.getAllByRole("listitem");
      expect(mine).toHaveClass("justify-end");
      expect(within(mine).getByText("あなた")).toBeInTheDocument();
      expect(theirs).toHaveClass("justify-start");
      expect(within(theirs).getByText("相手")).toBeInTheDocument();
    });
  });

  describe("もっと読む", () => {
    it("1ページしかない場合は表示しない", () => {
      renderThread({
        latestMessages: [makeMessage(1, ME, "メッセージ1")],
        lastPage: 1,
      });

      expect(
        screen.queryByRole("button", { name: "- もっと読む -" }),
      ).not.toBeInTheDocument();
    });

    it("押すと次のページを取得し、古いメッセージを上に足す", async () => {
      getMoreMessagesMock.mockResolvedValue({
        success: true,
        moreMessages: [
          makeMessage(2, OTHER, "メッセージ2"),
          makeMessage(1, ME, "メッセージ1"),
        ],
        lastPage: 2,
      });
      const user = userEvent.setup();
      renderThread({
        latestMessages: [
          makeMessage(4, ME, "メッセージ4"),
          makeMessage(3, OTHER, "メッセージ3"),
        ],
        lastPage: 2,
      });

      await user.click(screen.getByRole("button", { name: "- もっと読む -" }));

      expect(getMoreMessagesMock).toHaveBeenCalledWith(10, 2);
      expect(bodiesInOrder()).toEqual([
        "メッセージ1",
        "メッセージ2",
        "メッセージ3",
        "メッセージ4",
      ]);
      // 最後のページまで読んだのでボタンは消える
      expect(
        screen.queryByRole("button", { name: "- もっと読む -" }),
      ).not.toBeInTheDocument();
    });

    it("最後のページでなければ、続けて次のページを取得できる", async () => {
      getMoreMessagesMock
        .mockResolvedValueOnce({
          success: true,
          moreMessages: [makeMessage(2, OTHER, "メッセージ2")],
          lastPage: 3,
        })
        .mockResolvedValueOnce({
          success: true,
          moreMessages: [makeMessage(1, ME, "メッセージ1")],
          lastPage: 3,
        });
      const user = userEvent.setup();
      renderThread({
        latestMessages: [makeMessage(3, ME, "メッセージ3")],
        lastPage: 3,
      });

      await user.click(screen.getByRole("button", { name: "- もっと読む -" }));
      await user.click(
        await screen.findByRole("button", { name: "- もっと読む -" }),
      );

      expect(getMoreMessagesMock).toHaveBeenNthCalledWith(1, 10, 2);
      expect(getMoreMessagesMock).toHaveBeenNthCalledWith(2, 10, 3);
      expect(bodiesInOrder()).toEqual([
        "メッセージ1",
        "メッセージ2",
        "メッセージ3",
      ]);
    });

    it("新しいメッセージでページがずれても、同じメッセージを2回表示しない", async () => {
      // 1ページ目の取得後に新着が来て、1ページ目の最後(id 2)が2ページ目に押し出された状態
      getMoreMessagesMock.mockResolvedValue({
        success: true,
        moreMessages: [
          makeMessage(2, OTHER, "メッセージ2"),
          makeMessage(1, ME, "メッセージ1"),
        ],
        lastPage: 2,
      });
      const user = userEvent.setup();
      renderThread({
        latestMessages: [
          makeMessage(3, ME, "メッセージ3"),
          makeMessage(2, OTHER, "メッセージ2"),
        ],
        lastPage: 2,
      });

      await user.click(screen.getByRole("button", { name: "- もっと読む -" }));

      expect(bodiesInOrder()).toEqual([
        "メッセージ1",
        "メッセージ2",
        "メッセージ3",
      ]);
    });

    it("取得に失敗した場合はエラーのトーストを表示し、ボタンは残す", async () => {
      getMoreMessagesMock.mockResolvedValue({
        success: false,
        message: "メッセージの取得に失敗しました(500)",
      });
      const user = userEvent.setup();
      renderThread({
        latestMessages: [makeMessage(1, ME, "メッセージ1")],
        lastPage: 2,
      });

      await user.click(screen.getByRole("button", { name: "- もっと読む -" }));

      expect(toastErrorMock).toHaveBeenCalledWith(
        "メッセージの取得に失敗しました(500)",
        { position: "top-center" },
      );
      expect(
        screen.getByRole("button", { name: "- もっと読む -" }),
      ).toBeEnabled();
    });

    it("通信エラー時は汎用エラーのトーストを表示する", async () => {
      getMoreMessagesMock.mockRejectedValue(new Error("network error"));
      const user = userEvent.setup();
      renderThread({
        latestMessages: [makeMessage(1, ME, "メッセージ1")],
        lastPage: 2,
      });

      await user.click(screen.getByRole("button", { name: "- もっと読む -" }));

      expect(toastErrorMock).toHaveBeenCalledWith("通信エラーが発生しました", {
        position: "top-center",
      });
    });
  });
});
