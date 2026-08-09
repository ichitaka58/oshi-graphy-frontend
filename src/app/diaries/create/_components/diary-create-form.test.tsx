import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DiaryCreateForm from "./diary-create-form";

const {
  createDiaryMock,
  searchArtistsMock,
  pushMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  createDiaryMock: vi.fn(),
  searchArtistsMock: vi.fn(),
  pushMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("../../actions", () => ({
  createDiary: createDiaryMock,
}));

vi.mock("@/app/artists/actions", () => ({
  searchArtists: searchArtistsMock,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccessMock },
}));

// AIアシスト部分は別ファイルで単体テスト済みのため、ここでは
// onCopyReplyToBodyへの配線だけ確認できる最小のスタブに差し替える
vi.mock("./diary-ai-assist-form", () => ({
  default: ({
    onCopyReplyToBody,
  }: {
    onCopyReplyToBody: (text: string) => void;
  }) => (
    <button
      type="button"
      onClick={() => onCopyReplyToBody("AIが作成した文案")}
    >
      AI文案をコピー(テスト用)
    </button>
  ),
}));

async function selectArtist(
  user: ReturnType<typeof userEvent.setup>,
  name = "テストアーティスト",
) {
  await user.type(screen.getByPlaceholderText("アーティストを選択"), name);
  const item = await screen.findByText(name);
  await user.click(item);
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText("日付"),
    "2026-08-05",
  );
  await selectArtist(user);
  await user.type(screen.getByLabelText("本文"), "テスト本文です");
}

describe("DiaryCreateForm", () => {
  beforeEach(() => {
    createDiaryMock.mockReset();
    pushMock.mockReset();
    toastSuccessMock.mockClear();
    searchArtistsMock.mockReset();
    searchArtistsMock.mockResolvedValue([
      { id: 1, name: "テストアーティスト", kana: "てすと" },
    ]);
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  it("日付・アーティスト・本文・写真・公開設定の入力欄を表示する", () => {
    render(<DiaryCreateForm />);

    expect(screen.getByLabelText("日付")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("アーティストを選択"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("本文")).toBeInTheDocument();
    expect(screen.getByLabelText("写真")).toBeInTheDocument();
    expect(screen.getByLabelText("公開する")).toBeInTheDocument();
  });

  it("空欄で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("日付を入力してください"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("アーティストは必須入力です"),
    ).toBeInTheDocument();
    expect(screen.getByText("本文は必須入力です")).toBeInTheDocument();
    expect(createDiaryMock).not.toHaveBeenCalled();
  });

  it("入力してアーティストを検索し選択できる", async () => {
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await selectArtist(user);

    expect(searchArtistsMock).toHaveBeenCalledWith("テストアーティスト");
    expect(
      screen.getByPlaceholderText("アーティストを選択"),
    ).toHaveValue("テストアーティスト");
  });

  it("保存に成功した場合はトースト表示し一覧へ遷移する", async () => {
    createDiaryMock.mockResolvedValue({
      success: true,
      message: "日記を保存しました",
    });
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(createDiaryMock).toHaveBeenCalledTimes(1);
    const formData = createDiaryMock.mock.calls[0][0] as FormData;
    expect(formData.get("happened_on")).toBe("2026-08-05");
    expect(formData.get("artist_id")).toBe("1");
    expect(formData.get("body")).toBe("テスト本文です");
    expect(formData.get("is_public")).toBe("0");

    expect(toastSuccessMock).toHaveBeenCalledWith("日記を保存しました", {
      position: "top-center",
    });
    expect(pushMock).toHaveBeenCalledWith("/diaries");
  });

  it("公開設定をONにして送信するとis_publicが1で送信される", async () => {
    createDiaryMock.mockResolvedValue({
      success: true,
      message: "日記を保存しました",
    });
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await fillValidForm(user);
    await user.click(screen.getByLabelText("公開する"));
    await user.click(screen.getByRole("button", { name: "保存" }));

    const formData = createDiaryMock.mock.calls[0][0] as FormData;
    expect(formData.get("is_public")).toBe("1");
  });

  it("サーバーからフィールドエラーが返る場合はそのフィールドに表示する", async () => {
    createDiaryMock.mockResolvedValue({
      success: false,
      message: "日記の作成に失敗しました(422)",
      errors: { body: ["本文は既に使用されています"] },
    });
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("本文は既に使用されています"),
    ).toBeInTheDocument();
  });

  it("サーバーからroot以外のエラー情報がない場合はrootエラーを表示する", async () => {
    createDiaryMock.mockResolvedValue({
      success: false,
      message: "日記の作成に失敗しました(500)",
    });
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("日記の作成に失敗しました(500)"),
    ).toBeInTheDocument();
  });

  it("通信エラー時は汎用エラーメッセージを表示する", async () => {
    createDiaryMock.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(
      await screen.findByText("通信エラーが発生しました"),
    ).toBeInTheDocument();
  });

  it("AIアシストの本文コピーで本文欄に反映される", async () => {
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await user.click(
      screen.getByRole("button", { name: "AI文案をコピー(テスト用)" }),
    );

    expect(screen.getByLabelText("本文")).toHaveValue("AIが作成した文案");
  });

  it("画像を選択するとプレビューが表示される", async () => {
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("写真"), file);

    expect(await screen.findByAltText("preview-0")).toBeInTheDocument();
  });

  it("クリアボタンでフォームと画像入力がリセットされる", async () => {
    const user = userEvent.setup();
    render(<DiaryCreateForm />);

    await user.type(screen.getByLabelText("日付"), "2026-08-05");
    await user.type(screen.getByLabelText("本文"), "テスト本文です");
    await user.click(screen.getByRole("button", { name: "クリア" }));

    expect(screen.getByLabelText("日付")).toHaveValue("");
    expect(screen.getByLabelText("本文")).toHaveValue("");
  });
});
