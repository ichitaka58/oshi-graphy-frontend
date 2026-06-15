import z from "zod";

export const LoginFormSchema = z.object({
  email: z
    .email("メールアドレスが無効です")
    .min(1, "メールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// スキーマから型を自動作成
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
