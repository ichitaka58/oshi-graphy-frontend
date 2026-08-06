import { describe, expect, it } from "vitest";
import { UserProfileSchema } from "./user-profile";

function createFile(sizeInBytes: number, type: string, name = "icon.png") {
  return new File([new Uint8Array(sizeInBytes)], name, { type });
}

describe("UserProfileSchema", () => {
  it("iconなしの入力を許可する", () => {
    const result = UserProfileSchema.safeParse({ name: "テスト太郎" });
    expect(result.success).toBe(true);
  });

  it("正しいicon付きの入力を許可する", () => {
    const result = UserProfileSchema.safeParse({
      name: "テスト太郎",
      icon: createFile(1024, "image/png"),
      profile: "よろしくお願いします",
    });
    expect(result.success).toBe(true);
  });

  it("nameが空の場合はエラーになる", () => {
    const result = UserProfileSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("iconが2MBを超える場合はエラーになる", () => {
    const result = UserProfileSchema.safeParse({
      name: "テスト太郎",
      icon: createFile(2 * 1024 * 1024 + 1, "image/png"),
    });
    expect(result.success).toBe(false);
  });

  it("iconが許可されていない形式の場合はエラーになる", () => {
    const result = UserProfileSchema.safeParse({
      name: "テスト太郎",
      icon: createFile(1024, "image/gif"),
    });
    expect(result.success).toBe(false);
  });

  it("profileが1000文字を超える場合はエラーになる", () => {
    const result = UserProfileSchema.safeParse({
      name: "テスト太郎",
      profile: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});
