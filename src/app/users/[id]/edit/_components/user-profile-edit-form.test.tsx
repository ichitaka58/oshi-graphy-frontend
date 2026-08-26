import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserProfileEditForm from "./user-profile-edit-form";
import { User } from "@/types/user";

const { updateUserProfileMock, replaceMock } = vi.hoisted(() => ({
  updateUserProfileMock: vi.fn(),
  replaceMock: vi.fn(),
}));

vi.mock("@/app/users/actions", () => ({
  updateUserProfile: updateUserProfileMock,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  unstable_rethrow: vi.fn(),
}));

const user: User = {
  id: 1,
  name: "元の名前",
  email: "user@example.com",
  icon_path: "icons/1.png",
  profile: "元の自己紹介",
  is_admin: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  icon_url: "https://example.com/icons/1.png",
};

describe("UserProfileEditForm", () => {
  beforeEach(() => {
    updateUserProfileMock.mockReset();
    replaceMock.mockReset();
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  it("既存のプロフィール情報がフォームに反映される", () => {
    render(<UserProfileEditForm id="1" user={user} />);

    expect(screen.getByLabelText("名前")).toHaveValue("元の名前");
    expect(screen.getByLabelText("自己紹介")).toHaveValue("元の自己紹介");
    expect(screen.getByAltText("アイコンプレビュー")).toHaveAttribute(
      "src",
      "/storage/icons/1.png",
    );
  });

  it("アイコン未設定の場合はプレースホルダー画像を表示する", () => {
    render(
      <UserProfileEditForm id="1" user={{ ...user, icon_path: null }} />,
    );

    expect(screen.getByAltText("アイコンプレビュー")).toHaveAttribute(
      "src",
      "/images/icon_placeholder.png",
    );
  });

  it("名前を空にして送信するとバリデーションエラーを表示する", async () => {
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    await userEventInstance.clear(screen.getByLabelText("名前"));
    await userEventInstance.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("名前を入力してください"),
    ).toBeInTheDocument();
    expect(updateUserProfileMock).not.toHaveBeenCalled();
  });

  it("アイコン画像を選択するとプレビューが切り替わり削除ボタンが表示される", async () => {
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    const file = new File(["dummy"], "new-icon.png", { type: "image/png" });
    await userEventInstance.upload(screen.getByLabelText("アイコン"), file);

    expect(screen.getByAltText("アイコンプレビュー")).toHaveAttribute(
      "src",
      "blob:mock-url",
    );
    expect(
      screen.getByRole("button", { name: "アイコンを削除" }),
    ).toBeInTheDocument();
  });

  it("アイコン削除ボタンをクリックするとプレビューが消え削除フラグが立つ", async () => {
    updateUserProfileMock.mockResolvedValue({ success: true });
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    await userEventInstance.click(
      screen.getByRole("button", { name: "アイコンを削除" }),
    );

    expect(
      screen.queryByAltText("アイコンプレビュー"),
    ).not.toBeInTheDocument();

    await userEventInstance.click(screen.getByRole("button", { name: "保存" }));

    const [, formData] = updateUserProfileMock.mock.calls[0] as [
      string,
      FormData,
    ];
    expect(formData.get("delete_icon")).toBe("1");
    expect(formData.has("icon")).toBe(false);
  });

  it("保存に成功した場合はユーザー詳細ページへ遷移する", async () => {
    updateUserProfileMock.mockResolvedValue({ success: true });
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    await userEventInstance.clear(screen.getByLabelText("名前"));
    await userEventInstance.type(screen.getByLabelText("名前"), "新しい名前");
    await userEventInstance.click(screen.getByRole("button", { name: "保存" }));

    expect(updateUserProfileMock).toHaveBeenCalledTimes(1);
    const [id, formData] = updateUserProfileMock.mock.calls[0] as [
      string,
      FormData,
    ];
    expect(id).toBe("1");
    expect(formData.get("name")).toBe("新しい名前");
    expect(formData.get("profile")).toBe("元の自己紹介");
    expect(formData.has("icon")).toBe(false);
    expect(formData.has("delete_icon")).toBe(false);

    expect(replaceMock).toHaveBeenCalledWith("/users/1");
  });

  it("新しいアイコンを選択して保存するとFormDataにiconが含まれる", async () => {
    updateUserProfileMock.mockResolvedValue({ success: true });
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    const file = new File(["dummy"], "new-icon.png", { type: "image/png" });
    await userEventInstance.upload(screen.getByLabelText("アイコン"), file);
    await userEventInstance.click(screen.getByRole("button", { name: "保存" }));

    const [, formData] = updateUserProfileMock.mock.calls[0] as [
      string,
      FormData,
    ];
    expect(formData.get("icon")).toBeInstanceOf(File);
    expect((formData.get("icon") as File).name).toBe("new-icon.png");
  });

  it("サーバーからフィールドエラーが返る場合はそのフィールドに表示する", async () => {
    updateUserProfileMock.mockResolvedValue({
      success: false,
      message: "プロフィールの更新に失敗しました(422)",
      errors: { name: ["この名前は既に使用されています"] },
    });
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    await userEventInstance.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("この名前は既に使用されています"),
    ).toBeInTheDocument();
  });

  it("サーバーからのエラーにフィールド情報がない場合はrootエラーを表示する", async () => {
    updateUserProfileMock.mockResolvedValue({
      success: false,
      message: "プロフィールの更新に失敗しました(500)",
    });
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    await userEventInstance.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("プロフィールの更新に失敗しました(500)"),
    ).toBeInTheDocument();
  });

  it("通信エラー時は汎用エラーメッセージを表示する", async () => {
    updateUserProfileMock.mockRejectedValue(new Error("network error"));
    const userEventInstance = userEvent.setup();
    render(<UserProfileEditForm id="1" user={user} />);

    await userEventInstance.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("通信エラーが発生しました"),
    ).toBeInTheDocument();
  });
});
