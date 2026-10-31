import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserFollowSection from "./user-follow-section";

const { toggleUserFollowMock, startConversationMock, toastErrorMock } =
  vi.hoisted(() => ({
    toggleUserFollowMock: vi.fn(),
    startConversationMock: vi.fn(),
    toastErrorMock: vi.fn(),
  }));

vi.mock("../../actions", () => ({
  toggleUserFollow: toggleUserFollowMock,
}));

vi.mock("@/app/messages/actions", () => ({
  startConversation: startConversationMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: toastErrorMock },
}));

// フォロー一覧のドロワーはこのテストの対象外なので中身を差し替える
vi.mock("./followers-list-drawer", () => ({ default: () => null }));
vi.mock("./followings-list-drawer", () => ({ default: () => null }));

function renderSection(
  props: Partial<React.ComponentProps<typeof UserFollowSection>> = {},
) {
  return render(
    <UserFollowSection
      id="2"
      initialFollowingsCount={0}
      initialFollowersCount={0}
      initialIsFollowing={true}
      showFollowButton={true}
      isFollowedBy={true}
      {...props}
    />,
  );
}

describe("UserFollowSection の「メッセージを送る」ボタン", () => {
  beforeEach(() => {
    toggleUserFollowMock.mockReset();
    startConversationMock.mockReset();
    toastErrorMock.mockClear();
  });

  describe("表示条件", () => {
    it("相互フォローなら表示する", () => {
      renderSection();

      expect(
        screen.getByRole("button", { name: "メッセージを送る" }),
      ).toBeInTheDocument();
    });

    it("自分だけがフォローしている場合は表示しない", () => {
      renderSection({ initialIsFollowing: true, isFollowedBy: false });

      expect(
        screen.queryByRole("button", { name: "メッセージを送る" }),
      ).not.toBeInTheDocument();
    });

    it("相手だけがフォローしている場合は表示しない", () => {
      renderSection({ initialIsFollowing: false, isFollowedBy: true });

      expect(
        screen.queryByRole("button", { name: "メッセージを送る" }),
      ).not.toBeInTheDocument();
    });

    it("相互フォローの状態でフォローを外すと消える", async () => {
      toggleUserFollowMock.mockResolvedValue({
        success: true,
        following: false,
        followingsCount: 0,
        followersCount: 0,
      });
      const user = userEvent.setup();
      renderSection();

      await user.click(screen.getByRole("button", { name: "フォロー中" }));

      expect(toggleUserFollowMock).toHaveBeenCalledWith("2", true);
      expect(
        screen.queryByRole("button", { name: "メッセージを送る" }),
      ).not.toBeInTheDocument();
    });

    it("相手からフォローされている状態でフォローすると表示される", async () => {
      toggleUserFollowMock.mockResolvedValue({
        success: true,
        following: true,
        followingsCount: 0,
        followersCount: 1,
      });
      const user = userEvent.setup();
      renderSection({ initialIsFollowing: false, isFollowedBy: true });

      await user.click(screen.getByRole("button", { name: "フォロー" }));

      expect(
        await screen.findByRole("button", { name: "メッセージを送る" }),
      ).toBeInTheDocument();
    });
  });

  describe("押したとき", () => {
    it("相手のユーザーIDを数値にして startConversation を呼ぶ", async () => {
      startConversationMock.mockResolvedValue({ success: true });
      const user = userEvent.setup();
      renderSection();

      await user.click(screen.getByRole("button", { name: "メッセージを送る" }));

      expect(startConversationMock).toHaveBeenCalledTimes(1);
      expect(startConversationMock).toHaveBeenCalledWith(2);
      expect(toastErrorMock).not.toHaveBeenCalled();
    });

    it("失敗した場合はエラーのトーストを表示する", async () => {
      startConversationMock.mockResolvedValue({
        success: false,
        message: "会話の開始に失敗しました(403)",
      });
      const user = userEvent.setup();
      renderSection();

      await user.click(screen.getByRole("button", { name: "メッセージを送る" }));

      expect(toastErrorMock).toHaveBeenCalledWith(
        "会話の開始に失敗しました(403)",
        { position: "top-center" },
      );
    });

    it("通信エラー時は汎用エラーのトーストを表示する", async () => {
      startConversationMock.mockRejectedValue(new Error("network error"));
      const user = userEvent.setup();
      renderSection();

      await user.click(screen.getByRole("button", { name: "メッセージを送る" }));

      expect(toastErrorMock).toHaveBeenCalledWith("通信エラーが発生しました", {
        position: "top-center",
      });
    });
  });
});
