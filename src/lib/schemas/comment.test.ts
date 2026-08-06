import { describe, expect, it } from "vitest";
import { CommentFormSchema } from "./comment";

describe("CommentFormSchema", () => {
  it("本文のみの入力を許可する", () => {
    const result = CommentFormSchema.safeParse({ body: "コメントです" });
    expect(result.success).toBe(true);
  });

  it("parent_idを指定した入力を許可する", () => {
    const result = CommentFormSchema.safeParse({
      body: "返信です",
      parent_id: 1,
    });
    expect(result.success).toBe(true);
  });

  it("本文が空の場合はエラーになる", () => {
    const result = CommentFormSchema.safeParse({ body: "" });
    expect(result.success).toBe(false);
  });

  it("本文が2000文字を超える場合はエラーになる", () => {
    const result = CommentFormSchema.safeParse({ body: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("parent_idが1未満の場合はエラーになる", () => {
    const result = CommentFormSchema.safeParse({
      body: "コメントです",
      parent_id: 0,
    });
    expect(result.success).toBe(false);
  });
});
