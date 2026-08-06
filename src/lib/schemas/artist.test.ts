import { describe, expect, it } from "vitest";
import { ArtistFormSchema } from "./artist";

describe("ArtistFormSchema", () => {
  it("正しい入力を許可する", () => {
    const result = ArtistFormSchema.safeParse({
      name: "テストアーティスト",
      kana: "てすとあーてぃすと",
    });
    expect(result.success).toBe(true);
  });

  it("nameが空の場合はエラーになる", () => {
    const result = ArtistFormSchema.safeParse({ name: "", kana: "かな" });
    expect(result.success).toBe(false);
  });

  it("nameが100文字を超える場合はエラーになる", () => {
    const result = ArtistFormSchema.safeParse({
      name: "a".repeat(101),
      kana: "かな",
    });
    expect(result.success).toBe(false);
  });

  it("kanaが空の場合はエラーになる", () => {
    const result = ArtistFormSchema.safeParse({ name: "名前", kana: "" });
    expect(result.success).toBe(false);
  });

  it("kanaが100文字を超える場合はエラーになる", () => {
    const result = ArtistFormSchema.safeParse({
      name: "名前",
      kana: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});
