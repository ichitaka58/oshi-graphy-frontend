import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "./login-form";

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

describe("LoginForm", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = setLocationHref();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    (window as unknown as { location: Location }).location = originalLocation;
    vi.unstubAllGlobals();
  });

  it("メールアドレスとパスワードの入力欄を表示する", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("空欄で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText("メールアドレスが無効です"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("パスワードを入力してください"),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("認証に失敗した場合はエラーメッセージを表示する", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText("メールアドレスまたはパスワードが違います"),
    ).toBeInTheDocument();
    expect(window.location.href).toBe("");
  });

  it("ログインに成功した場合は/diariesへ遷移する", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(window.location.href).toBe("/diaries");
    });
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("Resetボタンで入力内容をクリアする", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(emailInput).toHaveValue("");
  });
});
