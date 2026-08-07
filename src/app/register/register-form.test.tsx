import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RegisterForm from "./register-form";

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

async function fillValidForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }> = {},
) {
  const values = {
    name: "テスト太郎",
    email: "test@example.com",
    password: "password123",
    password_confirmation: "password123",
    ...overrides,
  };
  await user.type(screen.getByLabelText("名前"), values.name);
  await user.type(screen.getByLabelText("Email"), values.email);
  await user.type(screen.getByLabelText("Password"), values.password);
  await user.type(
    screen.getByLabelText("Passwordの確認"),
    values.password_confirmation,
  );
}

describe("RegisterForm", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = setLocationHref();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    (window as unknown as { location: Location }).location = originalLocation;
    vi.unstubAllGlobals();
  });

  it("名前・メール・パスワード・確認用パスワードの入力欄を表示する", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("名前")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Passwordの確認")).toBeInTheDocument();
  });

  it("空欄で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: "新規登録" }));

    expect(
      await screen.findByText("名前を入力してください"),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("パスワードと確認用パスワードが一致しない場合はエラーを表示する", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user, { password_confirmation: "different123" });
    await user.click(screen.getByRole("button", { name: "新規登録" }));

    expect(await screen.findByText("パスワードが一致しません")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("サーバーからフィールドごとのエラーが返る場合はそのフィールドに表示する", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        errors: { email: ["このメールアドレスは既に使用されています"] },
      }),
    } as Response);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "新規登録" }));

    expect(
      await screen.findByText("このメールアドレスは既に使用されています"),
    ).toBeInTheDocument();
  });

  it("errorsを含まないエラーレスポンスの場合はルートエラーを表示する", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "新規登録" }));

    expect(
      await screen.findByText("登録ができませんでした"),
    ).toBeInTheDocument();
  });

  it("登録に成功した場合は/diariesへ遷移する", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "新規登録" }));

    await waitFor(() => {
      expect(window.location.href).toBe("/diaries");
    });
  });
});
