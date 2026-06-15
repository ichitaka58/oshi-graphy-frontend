import z from "zod";

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(255, "名前は255文字以下です"),
  email: z
    .email("メールアドレスが無効です")
    .min(1, "メールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
  password_confirmation: z.string().min(8, "パスワードは８文字以上で入力してください"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "パスワードが一致しません",
  path: ["password_confirmation"],
});

// スキーマから型を自動作成
export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
