import z from "zod";

export const MessageFormSchema = z.object({
  body: z
    .string()
    .min(1, "メッセージ本文を入力してください")
    .max(2000, "メッセージは2000文字以下にしてください"),
});

export type MessageFormValues = z.infer<typeof MessageFormSchema>;
