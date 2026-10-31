import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MessageForm from "./message-form";

const { sendMessageMock } = vi.hoisted(() => ({
  sendMessageMock: vi.fn(),
}));

vi.mock("../../actions", () => ({
  sendMessage: sendMessageMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

async function typeAndSubmit(text: string) {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText("メッセージを入力..."), text);
  await user.click(screen.getByRole("button", { name: "送信" }));
}

describe("MessageForm", () => {
  beforeEach(() => {
    sendMessageMock.mockReset();
  });

  it("空欄で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<MessageForm id={1} />);

    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(
      await screen.findByText("メッセージ本文を入力してください"),
    ).toBeInTheDocument();
    expect(sendMessageMock).not.toHaveBeenCalled();
  });

  it("送信に成功すると会話IDと本文を渡し、入力欄を空にする", async () => {
    sendMessageMock.mockResolvedValue({ success: true });
    render(<MessageForm id={3} />);

    await typeAndSubmit("こんにちは");

    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    const [id, formData] = sendMessageMock.mock.calls[0] as [number, FormData];
    expect(id).toBe(3);
    expect(formData.get("body")).toBe("こんにちは");
    await waitFor(() => {
      expect(screen.getByPlaceholderText("メッセージを入力...")).toHaveValue(
        "",
      );
    });
  });

  it("サーバーからフィールドエラーが返る場合はそのフィールドに表示する", async () => {
    sendMessageMock.mockResolvedValue({
      success: false,
      message: "メッセージの送信に失敗しました(422)",
      errors: { body: ["本文は2000文字以内で入力してください"] },
    });
    render(<MessageForm id={1} />);

    await typeAndSubmit("こんにちは");

    expect(
      await screen.findByText("本文は2000文字以内で入力してください"),
    ).toBeInTheDocument();
  });

  it("サーバーからのエラーにフィールド情報がない場合はrootエラーを表示する", async () => {
    sendMessageMock.mockResolvedValue({
      success: false,
      message: "メッセージの送信に失敗しました(403)",
    });
    render(<MessageForm id={1} />);

    await typeAndSubmit("こんにちは");

    expect(
      await screen.findByText("メッセージの送信に失敗しました(403)"),
    ).toBeInTheDocument();
    // 失敗時は入力内容を残す
    expect(screen.getByPlaceholderText("メッセージを入力...")).toHaveValue(
      "こんにちは",
    );
  });

  it("通信エラー時は汎用エラーメッセージを表示する", async () => {
    sendMessageMock.mockRejectedValue(new Error("network error"));
    render(<MessageForm id={1} />);

    await typeAndSubmit("こんにちは");

    expect(
      await screen.findByText("通信エラーが発生しました"),
    ).toBeInTheDocument();
  });
});
