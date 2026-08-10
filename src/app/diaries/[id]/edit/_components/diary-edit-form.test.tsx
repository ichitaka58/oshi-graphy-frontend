import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DiaryEditForm from "./diary-edit-form";
import { DiaryEditItem } from "@/types/diary";

const {
  updateDiaryMock,
  searchArtistsMock,
  pushMock,
  backMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  updateDiaryMock: vi.fn(),
  searchArtistsMock: vi.fn(),
  pushMock: vi.fn(),
  backMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("@/app/diaries/actions", () => ({
  updateDiary: updateDiaryMock,
}));

vi.mock("@/app/artists/actions", () => ({
  searchArtists: searchArtistsMock,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, back: backMock }),
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccessMock },
}));

const diary: DiaryEditItem = {
  id: 10,
  user_id: 1,
  artist_id: 1,
  happened_on: "2026-08-01T00:00:00Z",
  body: "元の本文です",
  is_public: false,
  created_at: "2026-08-01T00:00:00Z",
  updated_at: "2026-08-01T00:00:00Z",
  artist: {
    id: 1,
    name: "元のアーティスト",
    kana: "もとのあーてぃすと",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
  },
  images: [
    {
      id: 100,
      diary_id: 10,
      path: "diaries/100.jpg",
      created_at: "2026-08-01T00:00:00Z",
      updated_at: "2026-08-01T00:00:00Z",
    },
    {
      id: 101,
      diary_id: 10,
      path: "diaries/101.jpg",
      created_at: "2026-08-01T00:00:00Z",
      updated_at: "2026-08-01T00:00:00Z",
    },
  ],
};

describe("DiaryEditForm", () => {
  beforeEach(() => {
    updateDiaryMock.mockReset();
    pushMock.mockReset();
    backMock.mockReset();
    toastSuccessMock.mockClear();
    searchArtistsMock.mockReset();
    searchArtistsMock.mockResolvedValue([
      { id: 2, name: "新しいアーティスト", kana: "あたらしい" },
    ]);
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  it("既存の日記データがフォームに反映される", () => {
    render(<DiaryEditForm id="10" diary={diary} />);

    expect(screen.getByLabelText("日付")).toHaveValue("2026-08-01");
    expect(
      screen.getByPlaceholderText("アーティストを選択"),
    ).toHaveValue("元のアーティスト");
    expect(screen.getByLabelText("本文")).toHaveValue("元の本文です");
    expect(screen.getByLabelText("公開する")).not.toBeChecked();
    expect(screen.getByText("登録済みの写真")).toBeInTheDocument();
  });

  it("日付・本文を空にして送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    await user.clear(screen.getByLabelText("日付"));
    await user.clear(screen.getByLabelText("本文"));
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("日付を入力してください"),
    ).toBeInTheDocument();
    expect(screen.getByText("本文は必須入力です")).toBeInTheDocument();
    expect(updateDiaryMock).not.toHaveBeenCalled();
  });

  it("写真がない場合はメッセージを表示する", () => {
    render(
      <DiaryEditForm id="10" diary={{ ...diary, images: [] }} />,
    );

    expect(
      screen.getByText("この日記に写真はありません。"),
    ).toBeInTheDocument();
    expect(screen.queryByText("登録済みの写真")).not.toBeInTheDocument();
  });

  it("アーティストを変更できる", async () => {
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    const input = screen.getByPlaceholderText("アーティストを選択");
    await user.clear(input);
    await user.type(input, "新しい");
    const item = await screen.findByText("新しいアーティスト");
    await user.click(item);

    expect(input).toHaveValue("新しいアーティスト");
  });

  it("既存写真を削除選択して保存するとdelete_imagesが送信される", async () => {
    updateDiaryMock.mockResolvedValue({
      success: true,
      message: "日記を更新しました",
    });
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    await user.click(
      screen.getByLabelText((_, el) => el?.id === "form-update-diary-delete_images-100"),
    );
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(updateDiaryMock).toHaveBeenCalledTimes(1);
    const [id, formData] = updateDiaryMock.mock.calls[0] as [string, FormData];
    expect(id).toBe("10");
    expect(formData.getAll("delete_images[]")).toEqual(["100"]);
  });

  it("保存に成功した場合はトースト表示し一覧へ遷移する", async () => {
    updateDiaryMock.mockResolvedValue({
      success: true,
      message: "日記を更新しました",
    });
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    await user.click(screen.getByRole("button", { name: "保存" }));

    const [, formData] = updateDiaryMock.mock.calls[0] as [string, FormData];
    expect(formData.get("happened_on")).toBe("2026-08-01");
    expect(formData.get("artist_id")).toBe("1");
    expect(formData.get("body")).toBe("元の本文です");
    expect(formData.get("is_public")).toBe("0");

    expect(toastSuccessMock).toHaveBeenCalledWith("日記を更新しました", {
      position: "top-center",
    });
    expect(pushMock).toHaveBeenCalledWith("/diaries");
  });

  it("サーバーからフィールドエラーが返る場合はそのフィールドに表示する", async () => {
    updateDiaryMock.mockResolvedValue({
      success: false,
      message: "日記の更新に失敗しました(422)",
      errors: { body: ["本文は不正です"] },
    });
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByText("本文は不正です")).toBeInTheDocument();
  });

  it("通信エラー時は汎用エラーメッセージを表示する", async () => {
    updateDiaryMock.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("通信エラーが発生しました"),
    ).toBeInTheDocument();
  });

  it("画像を選択するとプレビューが表示される", async () => {
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("写真"), file);

    expect(await screen.findByAltText("preview-0")).toBeInTheDocument();
  });

  it("キャンセルボタンで前の画面に戻る", async () => {
    const user = userEvent.setup();
    render(<DiaryEditForm id="10" diary={diary} />);

    await user.click(screen.getByRole("button", { name: "前の画面に戻る" }));

    expect(backMock).toHaveBeenCalledOnce();
  });
});
