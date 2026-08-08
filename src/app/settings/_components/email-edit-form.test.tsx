import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EmailEditForm from "./email-edit-form";

const { updateEmailMock, toastSuccessMock } = vi.hoisted(() => ({
  updateEmailMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("../actions", () => ({
  updateEmail: updateEmailMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccessMock },
}));

describe("EmailEditForm", () => {
  beforeEach(() => {
    updateEmailMock.mockReset();
    toastSuccessMock.mockClear();
  });

  it("新しいメールアドレスの入力欄を表示する", () => {
    render(<EmailEditForm />);

    expect(screen.getByLabelText("新しいメールアドレス")).toBeInTheDocument();
  });

  it("空欄で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<EmailEditForm />);

    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(
      await screen.findByText("メールアドレスが無効です"),
    ).toBeInTheDocument();
    expect(updateEmailMock).not.toHaveBeenCalled();
  });

  it("更新に成功した場合はトーストを表示する", async () => {
    updateEmailMock.mockResolvedValue({
      success: true,
      message: "メールアドレスを変更しました",
    });
    const user = userEvent.setup();
    render(<EmailEditForm />);

    await user.type(
      screen.getByLabelText("新しいメールアドレス"),
      "new@example.com",
    );
    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(toastSuccessMock).toHaveBeenCalledWith(
      "メールアドレスを変更しました",
      expect.objectContaining({ position: "top-center" }),
    );
  });

  it("サーバーからフィールドエラーが返る場合はそのフィールドに表示する", async () => {
    updateEmailMock.mockResolvedValue({
      success: false,
      message: "メールアドレスの更新に失敗しました(422)",
      errors: { email: ["このメールアドレスは既に使用されています"] },
    });
    const user = userEvent.setup();
    render(<EmailEditForm />);

    await user.type(
      screen.getByLabelText("新しいメールアドレス"),
      "taken@example.com",
    );
    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(
      await screen.findByText("このメールアドレスは既に使用されています"),
    ).toBeInTheDocument();
  });

  it("通信エラー時は汎用エラーメッセージを表示する", async () => {
    updateEmailMock.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    render(<EmailEditForm />);

    await user.type(
      screen.getByLabelText("新しいメールアドレス"),
      "test@example.com",
    );
    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(
      await screen.findByText("通信エラーが発生しました"),
    ).toBeInTheDocument();
  });
});
