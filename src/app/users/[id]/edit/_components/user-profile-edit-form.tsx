"use client";

import { updateUserProfile } from "@/app/users/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UserProfileSchema,
  UserProfileValues,
} from "@/lib/schemas/user-profile";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {
  id: string;
  user: User;
};

const UserProfileEditForm = ({ id, user }: Props) => {
  const form = useForm<UserProfileValues>({
    resolver: zodResolver(UserProfileSchema),
    mode: "onSubmit",
    defaultValues: {
      name: user.name,
      icon: undefined,
      profile: user.profile || "",
    },
  });

  // ファイル選択inputはReactのstateで表示をリセットできないため、
  // refを使ってHTML要素を直接操作できるようにしておく
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [deleteIcon, setDeleteIcon] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.icon_url);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // createObjectURLで作ったURLは使い終わったら手動で解放しないとメモリが増え続けるため、
    // 新しいURLを作る前に古いものを解放する
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setIconFile(file);
    setDeleteIcon(false);
    setPreviewUrl(URL.createObjectURL(file));
    // ファイル選択はReact Hook Formが自動で検知できないため手動でフォームに値をセットする。
    // shouldValidate: true にすることでZodバリデーションも同時に実行する
    form.setValue("icon", file, { shouldValidate: true });
  };

  const handleDeleteIcon = () => {
    // createObjectURLで作ったURLはメモリを占有し続けるため、不要になったら手動で解放する
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setIconFile(null);
    setDeleteIcon(true);
    setPreviewUrl(null);
    form.resetField("icon");
    // ファイル選択inputの表示はReactのstateでは消せないため、refで直接クリアする
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const onSubmit = async (data: UserProfileValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("profile", data.profile ?? "");
    if (iconFile) {
      formData.append("icon", iconFile);
    } else if (deleteIcon) {
      // 「新しいファイルを選ばなかった」と「アイコンを削除した」を区別するためフラグを送る
      formData.append("delete_icon", "1");
    }

    const result = await updateUserProfile(id, formData);
    if(!result)return;
    if (!result.success) {
      form.setError("root", { message: result.message });
      return;
    }
    router.replace(`/users/${id}`);
  };

  return (
    <Card>
      <CardHeader className="justify-center">
        <CardTitle className="font-semibold">プロフィール編集</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form-update-user-profile"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {form.formState.errors.root && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          )}

          <FieldGroup>
            {/* 名前 */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-update-user-profile-name"
                    className="font-semibold"
                  >
                    名前
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-update-user-profile-name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-xs"
                    />
                  )}
                </Field>
              )}
            />
            {/* アイコン */}
            <Controller
              name="icon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-update-user-profile-icon"
                    className="font-semibold"
                  >
                    アイコン
                  </FieldLabel>
                  {/* アイコンプレビュー部分 */}
                  <div className="flex justify-center">
                    <div className="relative w-40 h-40">
                      {previewUrl ? (
                        <>
                          <img
                            src={previewUrl}
                            alt="アイコンプレビュー"
                            className="w-full h-full rounded-full object-cover shadow-md shadow-black/40"
                          />
                          <button
                            type="button"
                            onClick={handleDeleteIcon}
                            aria-label="アイコンを削除"
                            className="absolute -top-1 right-0 text-md"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-gray-100" />
                      )}
                    </div>
                  </div>
                  {/* 新しいアイコンファイル */}
                  <Input
                    ref={fileInputRef}
                    id="form-update-user-profile-icon"
                    type="file"
                    accept="image/*"
                    aria-invalid={fieldState.invalid}
                    name={field.name}
                    onChange={handleFileChange}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-xs"
                    />
                  )}
                </Field>
              )}
            />
            {/* 自己紹介文：profile */}
            <Controller
              name="profile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-update-user-profile-profile"
                    className="font-semibold"
                  >
                    自己紹介
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-update-user-profile-profile"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-center">
          <Button
            type="submit"
            form="form-update-user-profile"
            className="hover:bg-primary/70 cursor-pointer"
          >
            保存
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default UserProfileEditForm;
