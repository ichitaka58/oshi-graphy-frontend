import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DiaryAiAssistForm from "./diary-ai-assist-form";

const { suggestDiaryDraftMock } = vi.hoisted(() => ({
  suggestDiaryDraftMock: vi.fn(),
}));

vi.mock("../../actions", () => ({
  suggestDiaryDraft: suggestDiaryDraftMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

describe("DiaryAiAssistForm", () => {
  const onCopyReplyToBody = vi.fn();

  beforeEach(() => {
    suggestDiaryDraftMock.mockReset();
    onCopyReplyToBody.mockReset();
  });

  it("AIへの相談入力欄とボタンを表示する", () => {
    render(<DiaryAiAssistForm onCopyReplyToBody={onCopyReplyToBody} />);

    expect(screen.getByLabelText("AIへの相談を入力")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AIに相談" })).toBeInTheDocument();
  });

  it("10文字未満で相談するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<DiaryAiAssistForm onCopyReplyToBody={onCopyReplyToBody} />);

    await user.type(screen.getByLabelText("AIへの相談を入力"), "短い入力");
    await user.click(screen.getByRole("button", { name: "AIに相談" }));

    expect(
      await screen.findByText(
        "文案作成に必要な情報を入力してください（10文字以上）",
      ),
    ).toBeInTheDocument();
    expect(suggestDiaryDraftMock).not.toHaveBeenCalled();
  });

  it("相談に成功すると回答を表示し、次の会話用にinteraction_idを保持する", async () => {
    suggestDiaryDraftMock.mockResolvedValue({
      success: true,
      reply: "AIからの返信です",
      interactionId: "interaction-1",
    });
    const user = userEvent.setup();
    render(<DiaryAiAssistForm onCopyReplyToBody={onCopyReplyToBody} />);

    await user.type(
      screen.getByLabelText("AIへの相談を入力"),
      "アーティストのライブに行った感想を書きたいです",
    );
    await user.click(screen.getByRole("button", { name: "AIに相談" }));

    expect(await screen.findByText("AIからの返信です")).toBeInTheDocument();
    // 送信済みprompt欄はリセットされる
    expect(screen.getByLabelText("AIへの相談を入力")).toHaveValue("");
  });

  it("本文にコピーをクリックするとonCopyReplyToBodyが呼ばれ回答欄がクリアされる", async () => {
    suggestDiaryDraftMock.mockResolvedValue({
      success: true,
      reply: "AIからの返信です",
      interactionId: "interaction-1",
    });
    const user = userEvent.setup();
    render(<DiaryAiAssistForm onCopyReplyToBody={onCopyReplyToBody} />);

    await user.type(
      screen.getByLabelText("AIへの相談を入力"),
      "アーティストのライブに行った感想を書きたいです",
    );
    await user.click(screen.getByRole("button", { name: "AIに相談" }));
    await screen.findByText("AIからの返信です");

    await user.click(screen.getByRole("button", { name: "本文にコピー" }));

    expect(onCopyReplyToBody).toHaveBeenCalledWith("AIからの返信です");
    expect(screen.queryByText("AIからの返信です")).not.toBeInTheDocument();
  });

  it("相談に失敗した場合はエラーメッセージを表示する", async () => {
    suggestDiaryDraftMock.mockResolvedValue({
      success: false,
      message: "AIの文案作成に失敗しました(500)。短い入力で試してください",
    });
    const user = userEvent.setup();
    render(<DiaryAiAssistForm onCopyReplyToBody={onCopyReplyToBody} />);

    await user.type(
      screen.getByLabelText("AIへの相談を入力"),
      "アーティストのライブに行った感想を書きたいです",
    );
    await user.click(screen.getByRole("button", { name: "AIに相談" }));

    expect(
      await screen.findByText(
        "AIの文案作成に失敗しました(500)。短い入力で試してください",
      ),
    ).toBeInTheDocument();
  });

  it("会話リセットをクリックするとフォームと回答がリセットされる", async () => {
    suggestDiaryDraftMock.mockResolvedValue({
      success: true,
      reply: "AIからの返信です",
      interactionId: "interaction-1",
    });
    const user = userEvent.setup();
    render(<DiaryAiAssistForm onCopyReplyToBody={onCopyReplyToBody} />);

    await user.type(
      screen.getByLabelText("AIへの相談を入力"),
      "アーティストのライブに行った感想を書きたいです",
    );
    await user.click(screen.getByRole("button", { name: "AIに相談" }));
    await screen.findByText("AIからの返信です");

    await user.click(screen.getByRole("button", { name: "会話リセット" }));

    expect(screen.queryByText("AIからの返信です")).not.toBeInTheDocument();
    expect(screen.getByLabelText("AIへの相談を入力")).toHaveValue("");
  });
});
