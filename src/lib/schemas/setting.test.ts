import { describe, expect, it } from "vitest";
import {
  AccountDeleteSchema,
  EmailUpdateSchema,
  PasswordUpdateSchema,
} from "./setting";

describe("EmailUpdateSchema", () => {
  it("正しい入力を許可する", () => {
    const result = EmailUpdateSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("メールアドレスが不正な場合はエラーになる", () => {
    const result = EmailUpdateSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("大文字を含む場合はエラーになる", () => {
    const result = EmailUpdateSchema.safeParse({ email: "Test@Example.com" });
    expect(result.success).toBe(false);
  });

  it("255文字を超える場合はエラーになる", () => {
    const longLocal = "a".repeat(250);
    const result = EmailUpdateSchema.safeParse({
      email: `${longLocal}@example.com`,
    });
    expect(result.success).toBe(false);
  });
});

describe("PasswordUpdateSchema", () => {
  const validInput = {
    current_password: "currentPass1",
    password: "newPassword1",
    password_confirmation: "newPassword1",
  };

  it("正しい入力を許可する", () => {
    expect(PasswordUpdateSchema.safeParse(validInput).success).toBe(true);
  });

  it("現在のパスワードが空の場合はエラーになる", () => {
    const result = PasswordUpdateSchema.safeParse({
      ...validInput,
      current_password: "",
    });
    expect(result.success).toBe(false);
  });

  it("新しいパスワードが8文字未満の場合はエラーになる", () => {
    const result = PasswordUpdateSchema.safeParse({
      ...validInput,
      password: "short1",
      password_confirmation: "short1",
    });
    expect(result.success).toBe(false);
  });

  it("パスワードと確認用パスワードが一致しない場合はエラーになる", () => {
    const result = PasswordUpdateSchema.safeParse({
      ...validInput,
      password_confirmation: "different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["password_confirmation"]);
    }
  });
});

describe("AccountDeleteSchema", () => {
  it("正しい入力を許可する", () => {
    const result = AccountDeleteSchema.safeParse({ password: "password123" });
    expect(result.success).toBe(true);
  });

  it("パスワードが空の場合はエラーになる", () => {
    const result = AccountDeleteSchema.safeParse({ password: "" });
    expect(result.success).toBe(false);
  });
});
