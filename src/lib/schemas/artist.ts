import z from "zod";

export const ArtistCreateFormSchema = z.object({
  name: z
    .string()
    .min(1, "アーティスト名は必須入力です")
    .max(100, "100文字以内で入力してください"),
  kana: z
    .string()
    .min(1, "よみがなは必須入力です")
    .max(100, "100文字以内で入力してください"),
});

export type ArtistCreateFormValues = z.infer<typeof ArtistCreateFormSchema>;
