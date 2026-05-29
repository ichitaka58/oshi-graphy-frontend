import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

 export const DiaryCreateFormSchema = z.object({
   // "type=date"は、ブラウザから文字列を返す
   happened_on: z.string().min(1, "日付を入力してください"),
   // selectは文字列を返すため、z.numberでは不一致になる。coerceを使うと文字列を数値に変換する
   artist_id: z.coerce.number<number>().int().min(1, "アーティストは必須入力です"),
   body: z.string().min(1, "本文は必須入力です"),
   // 配列で検証
   images: z
     .array(
       z
         .instanceof(File)
         .refine(
           (file) => file.size <= MAX_FILE_SIZE,
           "画像サイズは5MB以下にしてください",
         )
         .refine(
           (file) => ACCEPTED_FILE_TYPES.includes(file.type),
           ".jpeg, jpg, png, webp形式のファイルのみ利用可能です",
         ),
     )
     .optional(),
   is_public: z.boolean(),
 });

// スキーマから型を自動作成
export type DiaryCreateFormValues = z.infer<typeof DiaryCreateFormSchema>;