import { describe, expect, it } from "vitest";
import { RegisterFormSchema } from "./register";

const validInput = {
  name: "テスト太郎",
  email: "test@example.com",
  password: "password123",
  password_confirmation: "password123",
};

describe("RegisterFormSchema", () => {
  it("正しい入力を許可する", () => {
    expect(RegisterFormSchema.safeParse(validInput).success).toBe(true);
  });

  it("名前が空の場合はエラーになる", () => {
    const result = RegisterFormSchema.safeParse({ ...validInput, name: "" });
    expect(result.success).toBe(false);
  });

  it("名前が256文字を超える場合はエラーになる", () => {
    const result = RegisterFormSchema.safeParse({
      ...validInput,
      name: "a".repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it("メールアドレスが不正な場合はエラーになる", () => {
    const result = RegisterFormSchema.safeParse({
      ...validInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("パスワードが8文字未満の場合はエラーになる", () => {
    const result = RegisterFormSchema.safeParse({
      ...validInput,
      password: "short1",
      password_confirmation: "short1",
    });
    expect(result.success).toBe(false);
  });

  it("パスワードと確認用パスワードが一致しない場合はエラーになる", () => {
    const result = RegisterFormSchema.safeParse({
      ...validInput,
      password_confirmation: "different123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["password_confirmation"]);
    }
  });
});
