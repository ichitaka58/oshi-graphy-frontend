import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Artist } from "@/types/artist";
import ArtistForm from "./artist-form";

const { createArtistMock, updateArtistMock, pushMock, toastSuccessMock } =
  vi.hoisted(() => ({
    createArtistMock: vi.fn(),
    updateArtistMock: vi.fn(),
    pushMock: vi.fn(),
    toastSuccessMock: vi.fn(),
  }));

vi.mock("../actions", () => ({
  createArtist: createArtistMock,
  updateArtist: updateArtistMock,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccessMock },
}));

const mockArtist: Artist = {
  id: 1,
  name: "既存アーティスト",
  kana: "きぞんあーてぃすと",
  created_at: "2025-06-01T00:00:00Z",
  updated_at: "2025-06-01T00:00:00Z",
  deleted_at: null,
};

describe("ArtistForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    toastSuccessMock.mockClear();
    createArtistMock.mockReset();
    updateArtistMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("作成モードでは空の入力欄を表示する", () => {
    render(<ArtistForm mode="create" />);

    expect(screen.getByLabelText("アーティスト名")).toHaveValue("");
    expect(screen.getByLabelText("よみがな")).toHaveValue("");
  });

  it("編集モードでは既存の値を表示する", () => {
    render(<ArtistForm mode="edit" id="1" artist={mockArtist} />);

    expect(screen.getByLabelText("アーティスト名")).toHaveValue("既存アーティスト");
    expect(screen.getByLabelText("よみがな")).toHaveValue("きぞんあーてぃすと");
  });

  it("空欄で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<ArtistForm mode="create" />);

    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("アーティスト名は必須入力です"),
    ).toBeInTheDocument();
    expect(screen.getByText("よみがなは必須入力です")).toBeInTheDocument();
    expect(createArtistMock).not.toHaveBeenCalled();
  });

  it("作成に成功した場合はトーストを表示して一覧へ遷移する", async () => {
    createArtistMock.mockResolvedValue({
      success: true,
      message: "アーティストを登録しました",
    });
    const user = userEvent.setup();
    render(<ArtistForm mode="create" />);

    await user.type(screen.getByLabelText("アーティスト名"), "新アーティスト");
    await user.type(screen.getByLabelText("よみがな"), "しんあーてぃすと");
    await user.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/admin/artists");
    });
    expect(toastSuccessMock).toHaveBeenCalledWith(
      "アーティストを登録しました",
      expect.objectContaining({ position: "top-center" }),
    );
    const formData = createArtistMock.mock.calls[0][0] as FormData;
    expect(formData.get("name")).toBe("新アーティスト");
    expect(formData.get("kana")).toBe("しんあーてぃすと");
  });

  it("編集モードでは更新アクションが呼ばれる", async () => {
    updateArtistMock.mockResolvedValue({
      success: true,
      message: "アーティスト情報を更新しました",
    });
    const user = userEvent.setup();
    render(<ArtistForm mode="edit" id="1" artist={mockArtist} />);

    await user.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(updateArtistMock).toHaveBeenCalledWith("1", expect.any(FormData));
    });
    expect(createArtistMock).not.toHaveBeenCalled();
  });

  it("サーバーからフィールドエラーが返る場合はそのフィールドに表示する", async () => {
    createArtistMock.mockResolvedValue({
      success: false,
      message: "アーティストの登録に失敗しました(422)",
      errors: { name: ["このアーティスト名は既に登録されています"] },
    });
    const user = userEvent.setup();
    render(<ArtistForm mode="create" />);

    await user.type(screen.getByLabelText("アーティスト名"), "重複名");
    await user.type(screen.getByLabelText("よみがな"), "じゅうふくめい");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("このアーティスト名は既に登録されています"),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("errorsを含まないエラーの場合はルートエラーメッセージを表示する", async () => {
    createArtistMock.mockResolvedValue({
      success: false,
      message: "アーティストの登録に失敗しました(500)",
    });
    const user = userEvent.setup();
    render(<ArtistForm mode="create" />);

    await user.type(screen.getByLabelText("アーティスト名"), "テスト");
    await user.type(screen.getByLabelText("よみがな"), "てすと");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("アーティストの登録に失敗しました(500)"),
    ).toBeInTheDocument();
  });

  it("通信エラー時は汎用エラーメッセージを表示する", async () => {
    createArtistMock.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    render(<ArtistForm mode="create" />);

    await user.type(screen.getByLabelText("アーティスト名"), "テスト");
    await user.type(screen.getByLabelText("よみがな"), "てすと");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("通信エラーが発生しました"),
    ).toBeInTheDocument();
  });

  it("クリアボタンで入力内容をリセットする", async () => {
    const user = userEvent.setup();
    render(<ArtistForm mode="create" />);

    const nameInput = screen.getByLabelText("アーティスト名");
    await user.type(nameInput, "入力中");
    expect(nameInput).toHaveValue("入力中");

    await user.click(screen.getByRole("button", { name: "クリア" }));

    expect(nameInput).toHaveValue("");
  });
});
