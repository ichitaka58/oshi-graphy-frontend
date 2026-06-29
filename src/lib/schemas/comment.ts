import z from "zod";

export const CommentFormSchema = z.object({
  body: z
    .string()
    .min(1, "本文は必須入力です")
    .max(2000, "コメントは2000文字以下にしてください"),
  parent_id: z.int().min(1).optional(), // 返信用 1以上の整数、z.int()やz.number()はデフォルトでrequired
});

export type CommentFormValues = z.infer<typeof CommentFormSchema>;
