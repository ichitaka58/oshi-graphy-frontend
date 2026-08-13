import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CommentFormDrawer from "./comment-form-drawer";
import { TooltipProvider } from "@/components/ui/tooltip";

const { createCommentMock, toastSuccessMock } = vi.hoisted(() => ({
  createCommentMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("./actions", () => ({
  createComment: createCommentMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccessMock },
}));

function renderDrawer(
  props: Partial<React.ComponentProps<typeof CommentFormDrawer>> = {},
) {
  return render(
    <TooltipProvider>
      <CommentFormDrawer
        diaryId="1"
        path="/diaries/1"
        isReply={false}
        {...props}
      />
    </TooltipProvider>,
  );
}

describe("CommentFormDrawer", () => {
  beforeEach(() => {
    createCommentMock.mockReset();
    toastSuccessMock.mockClear();
  });

  describe("新規コメント（isReply=false）", () => {
    it("トリガーをクリックするとコメント入力ドロワーが開く", async () => {
      const user = userEvent.setup();
      renderDrawer();

      await user.click(screen.getByRole("button"));

      expect(await screen.findByText("コメント")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("コメントを入力..."),
      ).toBeInTheDocument();
    });

    it("空欄で送信するとバリデーションエラーを表示する", async () => {
      const user = userEvent.setup();
      renderDrawer();

      await user.click(screen.getByRole("button"));
      await user.click(
        await screen.findByRole("button", { name: "コメントする" }),
      );

      expect(
        await screen.findByText("本文は必須入力です"),
      ).toBeInTheDocument();
      expect(createCommentMock).not.toHaveBeenCalled();
    });

    it("送信に成功するとトーストを表示しドロワーを閉じる", async () => {
      createCommentMock.mockResolvedValue({
        success: true,
        message: "コメントを投稿しました",
      });
      const user = userEvent.setup();
      renderDrawer();

      await user.click(screen.getByRole("button"));
      await user.type(
        await screen.findByPlaceholderText("コメントを入力..."),
        "テストコメント",
      );
      await user.click(screen.getByRole("button", { name: "コメントする" }));

      expect(createCommentMock).toHaveBeenCalledTimes(1);
      const [formData, diaryId, path, isReply] = createCommentMock.mock
        .calls[0] as [FormData, string, string, boolean];
      expect(formData.get("body")).toBe("テストコメント");
      expect(formData.has("parent_id")).toBe(false);
      expect(diaryId).toBe("1");
      expect(path).toBe("/diaries/1");
      expect(isReply).toBe(false);

      expect(toastSuccessMock).toHaveBeenCalledWith("コメントを投稿しました", {
        position: "top-center",
      });
      // vaulはクローズ時もDOMにコンテンツを残しdata-state="closed"にするだけのため、
      // 消滅ではなくdata-state属性で開閉状態を確認する
      await waitFor(() => {
        expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute(
          "data-state",
          "closed",
        );
      });
    });

    it("サーバーからフィールドエラーが返る場合はそのフィールドに表示する", async () => {
      createCommentMock.mockResolvedValue({
        success: false,
        message: "コメントの作成に失敗しました(422)",
        errors: { body: ["不適切な内容が含まれています"] },
      });
      const user = userEvent.setup();
      renderDrawer();

      await user.click(screen.getByRole("button"));
      await user.type(
        await screen.findByPlaceholderText("コメントを入力..."),
        "テストコメント",
      );
      await user.click(screen.getByRole("button", { name: "コメントする" }));

      expect(
        await screen.findByText("不適切な内容が含まれています"),
      ).toBeInTheDocument();
    });

    it("サーバーからのエラーにフィールド情報がない場合はrootエラーを表示する", async () => {
      createCommentMock.mockResolvedValue({
        success: false,
        message: "コメントの作成に失敗しました(500)",
      });
      const user = userEvent.setup();
      renderDrawer();

      await user.click(screen.getByRole("button"));
      await user.type(
        await screen.findByPlaceholderText("コメントを入力..."),
        "テストコメント",
      );
      await user.click(screen.getByRole("button", { name: "コメントする" }));

      expect(
        await screen.findByText("コメントの作成に失敗しました(500)"),
      ).toBeInTheDocument();
    });

    it("通信エラー時は汎用エラーメッセージを表示する", async () => {
      createCommentMock.mockRejectedValue(new Error("network error"));
      const user = userEvent.setup();
      renderDrawer();

      await user.click(screen.getByRole("button"));
      await user.type(
        await screen.findByPlaceholderText("コメントを入力..."),
        "テストコメント",
      );
      await user.click(screen.getByRole("button", { name: "コメントする" }));

      expect(
        await screen.findByText("通信エラーが発生しました"),
      ).toBeInTheDocument();
    });
  });

  describe("返信（isReply=true）", () => {
    it("返信リンクをクリックすると返信用ドロワーが開く", async () => {
      const user = userEvent.setup();
      renderDrawer({ isReply: true, parentId: 5, commentUserName: "山田" });

      await user.click(screen.getByRole("button", { name: "-返信-" }));

      expect(await screen.findByText("コメント返信")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("山田 への返信を入力..."),
      ).toBeInTheDocument();
    });

    it("送信するとparent_idを含めて送信される", async () => {
      createCommentMock.mockResolvedValue({
        success: true,
        message: "返信を投稿しました",
      });
      const user = userEvent.setup();
      renderDrawer({ isReply: true, parentId: 5, commentUserName: "山田" });

      await user.click(screen.getByRole("button", { name: "-返信-" }));
      await user.type(
        await screen.findByPlaceholderText("山田 への返信を入力..."),
        "テスト返信",
      );
      await user.click(screen.getByRole("button", { name: "返信する" }));

      expect(createCommentMock).toHaveBeenCalledTimes(1);
      const [formData, , , isReply] = createCommentMock.mock.calls[0] as [
        FormData,
        string,
        string,
        boolean,
      ];
      expect(formData.get("body")).toBe("テスト返信");
      expect(formData.get("parent_id")).toBe("5");
      expect(isReply).toBe(true);
      expect(toastSuccessMock).toHaveBeenCalledWith("返信を投稿しました", {
        position: "top-center",
      });
    });
  });

  it("キャンセルボタンをクリックするとドロワーが閉じる", async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.click(screen.getByRole("button"));
    await screen.findByPlaceholderText("コメントを入力...");
    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute(
        "data-state",
        "closed",
      );
    });
  });
});
