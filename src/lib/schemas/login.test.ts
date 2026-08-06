import { describe, expect, it } from "vitest";
import { LoginFormSchema } from "./login";

describe("LoginFormSchema", () => {
  it("正しい入力を許可する", () => {
    const result = LoginFormSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("メールアドレスが不正な場合はエラーになる", () => {
    const result = LoginFormSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("メールアドレスが空の場合はエラーになる", () => {
    const result = LoginFormSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("パスワードが空の場合はエラーになる", () => {
    const result = LoginFormSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
