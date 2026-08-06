import { describe, expect, it } from "vitest";
import {
  DiaryAiAssistFormSchema,
  DiaryCreateFormSchema,
  DiaryUpdateFormSchema,
} from "./diary";

function createFile(sizeInBytes: number, type: string, name = "photo.png") {
  return new File([new Uint8Array(sizeInBytes)], name, { type });
}

const validCreateInput = {
  happened_on: "2025-06-01",
  artist_id: 1,
  body: "本文です",
  is_public: true,
};

describe("DiaryCreateFormSchema", () => {
  it("正しい入力を許可する", () => {
    expect(DiaryCreateFormSchema.safeParse(validCreateInput).success).toBe(
      true,
    );
  });

  it("artist_idの文字列を数値に変換する", () => {
    const result = DiaryCreateFormSchema.safeParse({
      ...validCreateInput,
      artist_id: "1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.artist_id).toBe(1);
    }
  });

  it("happened_onが空の場合はエラーになる", () => {
    const result = DiaryCreateFormSchema.safeParse({
      ...validCreateInput,
      happened_on: "",
    });
    expect(result.success).toBe(false);
  });

  it("artist_idが1未満の場合はエラーになる", () => {
    const result = DiaryCreateFormSchema.safeParse({
      ...validCreateInput,
      artist_id: 0,
    });
    expect(result.success).toBe(false);
  });

  it("bodyが空の場合はエラーになる", () => {
    const result = DiaryCreateFormSchema.safeParse({
      ...validCreateInput,
      body: "",
    });
    expect(result.success).toBe(false);
  });

  it("imagesが5MBを超える場合はエラーになる", () => {
    const result = DiaryCreateFormSchema.safeParse({
      ...validCreateInput,
      images: [createFile(5 * 1024 * 1024 + 1, "image/png")],
    });
    expect(result.success).toBe(false);
  });

  it("imagesが許可されていない形式の場合はエラーになる", () => {
    const result = DiaryCreateFormSchema.safeParse({
      ...validCreateInput,
      images: [createFile(1024, "image/gif")],
    });
    expect(result.success).toBe(false);
  });

  it("imagesなしの入力を許可する", () => {
    const result = DiaryCreateFormSchema.safeParse(validCreateInput);
    expect(result.success).toBe(true);
  });
});

describe("DiaryUpdateFormSchema", () => {
  const validUpdateInput = { ...validCreateInput };

  it("正しい入力を許可する", () => {
    expect(DiaryUpdateFormSchema.safeParse(validUpdateInput).success).toBe(
      true,
    );
  });

  it("delete_imagesを指定した入力を許可する", () => {
    const result = DiaryUpdateFormSchema.safeParse({
      ...validUpdateInput,
      delete_images: [1, 2],
    });
    expect(result.success).toBe(true);
  });

  it("bodyが空の場合はエラーになる", () => {
    const result = DiaryUpdateFormSchema.safeParse({
      ...validUpdateInput,
      body: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("DiaryAiAssistFormSchema", () => {
  it("正しい入力を許可する", () => {
    const result = DiaryAiAssistFormSchema.safeParse({
      interaction_id: null,
      prompt: "10文字以上のプロンプトです",
    });
    expect(result.success).toBe(true);
  });

  it("interaction_idに文字列を指定した入力を許可する", () => {
    const result = DiaryAiAssistFormSchema.safeParse({
      interaction_id: "abc-123",
      prompt: "10文字以上のプロンプトです",
    });
    expect(result.success).toBe(true);
  });

  it("promptが10文字未満の場合はエラーになる", () => {
    const result = DiaryAiAssistFormSchema.safeParse({
      interaction_id: null,
      prompt: "短い",
    });
    expect(result.success).toBe(false);
  });

  it("promptが2000文字を超える場合はエラーになる", () => {
    const result = DiaryAiAssistFormSchema.safeParse({
      interaction_id: null,
      prompt: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
