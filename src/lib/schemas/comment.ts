import z from "zod";

export const CommentFormSchema = z.object({
  body: z
    .string()
    .min(1, "本文は必須入力です")
    .max(2000, "コメントは2000文字以下にしてください"),
});

export type CommentFormValues = z.infer<typeof CommentFormSchema>;
