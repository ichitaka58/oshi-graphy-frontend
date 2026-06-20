import z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const UserProfileSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(255, "名前は255文字以下です"),
  icon: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "画像サイズは2MB以下にしてください",
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      ".jpeg, jpg, png, webp形式のファイルのみ利用可能です",
    )
    .optional(),
  profile: z
    .string()
    .max(1000, "プロフィールは1000文字以下にしてください")
    .optional(),
});

export type UserProfileValues = z.infer<typeof UserProfileSchema>;
