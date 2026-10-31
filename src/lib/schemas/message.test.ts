import { describe, expect, it } from "vitest";
import { MessageFormSchema } from "./message";

describe("MessageFormSchema", () => {
  it("本文を入力すれば許可する", () => {
    const result = MessageFormSchema.safeParse({ body: "こんにちは" });
    expect(result.success).toBe(true);
  });

  it("本文がちょうど2000文字なら許可する", () => {
    const result = MessageFormSchema.safeParse({ body: "あ".repeat(2000) });
    expect(result.success).toBe(true);
  });

  it("本文が空の場合はエラーになる", () => {
    const result = MessageFormSchema.safeParse({ body: "" });
    expect(result.success).toBe(false);
  });

  it("本文が2000文字を超える場合はエラーになる", () => {
    const result = MessageFormSchema.safeParse({ body: "あ".repeat(2001) });
    expect(result.success).toBe(false);
  });
});
