import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PasswordUpdateForm from "./password-update-form";

const { updatePasswordMock, toastSuccessMock } = vi.hoisted(() => ({
  updatePasswordMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("../actions", () => ({
  updatePassword: updatePasswordMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccessMock },
}));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("現在のパスワード"), "current-pass1");
  await user.type(screen.getByLabelText("新しいパスワード"), "new-password1");
  await user.type(
    screen.getByLabelText("確認用パスワード"),
    "new-password1",
  );
}

describe("PasswordUpdateForm", () => {
  beforeEach(() => {
    updatePasswordMock.mockReset();
    toastSuccessMock.mockClear();
  });

  it("現在・新規・確認用パスワードの入力欄を表示する", () => {
    render(<PasswordUpdateForm />);

    expect(screen.getByLabelText("現在のパスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("新しいパスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("確認用パスワード")).toBeInTheDocument();
  });

  it("空欄で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<PasswordUpdateForm />);

    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(
      await screen.findByText("現在のパスワードを入力してください"),
    ).toBeInTheDocument();
    expect(updatePasswordMock).not.toHaveBeenCalled();
  });

  it("新しいパスワードと確認用が一致しない場合はエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<PasswordUpdateForm />);

    await user.type(screen.getByLabelText("現在のパスワード"), "current-pass1");
    await user.type(screen.getByLabelText("新しいパスワード"), "new-password1");
    await user.type(
      screen.getByLabelText("確認用パスワード"),
      "different-pass1",
    );
    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(
      await screen.findByText("パスワードが一致しません"),
    ).toBeInTheDocument();
    expect(updatePasswordMock).not.toHaveBeenCalled();
  });

  it("更新に成功した場合はフォームをリセットしトーストを表示する", async () => {
    updatePasswordMock.mockResolvedValue({
      success: true,
      message: "パスワードを変更しました",
    });
    const user = userEvent.setup();
    render(<PasswordUpdateForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(toastSuccessMock).toHaveBeenCalledWith(
      "パスワードを変更しました",
      expect.objectContaining({ position: "top-center" }),
    );
    expect(await screen.findByLabelText("現在のパスワード")).toHaveValue("");
  });

  it("現在のパスワードが間違っている場合はサーバーエラーを表示する", async () => {
    updatePasswordMock.mockResolvedValue({
      success: false,
      message: "パスワードの変更に失敗しました(422)",
      errors: { current_password: ["現在のパスワードが正しくありません"] },
    });
    const user = userEvent.setup();
    render(<PasswordUpdateForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "送信" }));

    expect(
      await screen.findByText("現在のパスワードが正しくありません"),
    ).toBeInTheDocument();
  });

  it("表示切り替えボタンでパスワードの表示/非表示を切り替えられる", async () => {
    const user = userEvent.setup();
    render(<PasswordUpdateForm />);

    const input = screen.getByLabelText("現在のパスワード");
    expect(input).toHaveAttribute("type", "password");

    const fieldGroup = input.closest('[role="group"]');
    if (!fieldGroup) throw new Error("field group not found");
    const toggleButton = within(fieldGroup as HTMLElement).getByRole(
      "button",
    );
    await user.click(toggleButton);

    expect(input).toHaveAttribute("type", "text");
  });
});
