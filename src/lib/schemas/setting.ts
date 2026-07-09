import z from "zod";

export const EmailUpdateSchema = z.object({
  email: z
    .email("メールアドレスが無効です")
    .min(1, "メールアドレスを入力してください")
    .max(255, "メールアドレスは255文字以下にしてください")
    .lowercase("すべて小文字で入力してください"),
});

export type EmailUpdateValues = z.infer<typeof EmailUpdateSchema>;

export const PasswordUpdateSchema = z.object({
  current_password: z.string().min(1, "現在のパスワードを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上にしてください"),
  password_confirmation: z.string().min(1, "確認用パスワードを入力してください"),
})
.refine((data) => data.password === data.password_confirmation, {
  message: "パスワードが一致しません",
  path: ["password_confirmation"],
});

export type PasswordUpdateValues = z.infer<typeof PasswordUpdateSchema>;

