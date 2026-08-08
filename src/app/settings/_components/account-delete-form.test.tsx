import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AccountDeleteForm from "./account-delete-form";

const { deleteAccountMock } = vi.hoisted(() => ({
  deleteAccountMock: vi.fn(),
}));

vi.mock("../actions", () => ({
  deleteAccount: deleteAccountMock,
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: vi.fn(),
}));

function setLocationHref(initial = "") {
  const originalLocation = window.location;
  // @ts-expect-error jsdomのlocationは直接代入できないため一旦削除する
  delete window.location;
  (window as unknown as { location: Location }).location = {
    ...originalLocation,
    href: initial,
  };
  return originalLocation;
}

describe("AccountDeleteForm", () => {
  let originalLocation: Location;

  beforeEach(() => {
    deleteAccountMock.mockReset();
    originalLocation = setLocationHref();
  });

  afterEach(() => {
    (window as unknown as { location: Location }).location = originalLocation;
  });

  it("削除ボタンをクリックすると確認ダイアログが表示される", async () => {
    const user = userEvent.setup();
    render(<AccountDeleteForm />);

    await user.click(
      screen.getByRole("button", { name: "アカウントを削除する" }),
    );

    expect(
      await screen.findByText("❗️本当にアカウントを削除しますか？"),
    ).toBeInTheDocument();
  });

  it("パスワードが空の場合はバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<AccountDeleteForm />);

    await user.click(
      screen.getByRole("button", { name: "アカウントを削除する" }),
    );
    await user.click(screen.getByRole("button", { name: "アカウント削除" }));

    expect(
      await screen.findByText("パスワードを入力してください"),
    ).toBeInTheDocument();
    expect(deleteAccountMock).not.toHaveBeenCalled();
  });

  it("正しいパスワードで削除に成功するとトップページへ遷移する", async () => {
    deleteAccountMock.mockResolvedValue({
      success: true,
      message: "アカウントを削除しました",
    });
    const user = userEvent.setup();
    render(<AccountDeleteForm />);

    await user.click(
      screen.getByRole("button", { name: "アカウントを削除する" }),
    );
    await user.type(
      screen.getByPlaceholderText("パスワード..."),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: "アカウント削除" }));

    await waitFor(() => {
      expect(window.location.href).toBe("/");
    });
    expect(deleteAccountMock).toHaveBeenCalledWith("password123");
  });

  it("パスワードが間違っている場合はエラーメッセージを表示する", async () => {
    deleteAccountMock.mockResolvedValue({
      success: false,
      message: "アカウントの削除に失敗しました(422)",
      errors: { password: ["パスワードが正しくありません"] },
    });
    const user = userEvent.setup();
    render(<AccountDeleteForm />);

    await user.click(
      screen.getByRole("button", { name: "アカウントを削除する" }),
    );
    await user.type(
      screen.getByPlaceholderText("パスワード..."),
      "wrong-password",
    );
    await user.click(screen.getByRole("button", { name: "アカウント削除" }));

    expect(
      await screen.findByText("パスワードが正しくありません"),
    ).toBeInTheDocument();
    expect(window.location.href).toBe("");
  });
});
