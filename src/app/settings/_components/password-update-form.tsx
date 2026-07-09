"use client";

import {
  PasswordUpdateSchema,
  PasswordUpdateValues,
} from "@/lib/schemas/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { updatePassword } from "../actions";
import { toast } from "sonner";
import { unstable_rethrow } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PasswordUpdateForm = () => {
  const form = useForm<PasswordUpdateValues>({
    resolver: zodResolver(PasswordUpdateSchema),
    mode: "onSubmit",
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: PasswordUpdateValues) => {
    try {
      const formData = new FormData();
      formData.append("current_password", data.current_password);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      const result = await updatePassword(formData);
      if (!result.success) {
        if(result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof PasswordUpdateValues, { message: (messages as string[])[0]});
          }
        } else {
        form.setError("root", { message: result.message });
        }
        return;
      }
      toast.success(result.message, { position: "top-center" });
    } catch (error) {
      // updateEmail内のredirect("/login")はNext.jsがNEXT_REDIRECT例外を
      // throwすることで実現されている。ここで無条件にcatchすると
      // そのリダイレクト用の例外まで握りつぶしてしまうため、
      // redirect/notFound等の例外だけはunstable_rethrowで再送出しNext.jsに処理を戻す。
      unstable_rethrow(error);
      // ここに到達するのは本当の通信エラー等のみ
      form.setError("root", { message: "通信エラーが発生しました" });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">パスワードの変更</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-update-password" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          )}
          <FieldGroup>
            <Controller
              name="current_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-update-password-current_password">
                    現在のパスワード
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-update-password-current_password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="現在のパスワードを入力"
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-update-password-password">
                    新しいパスワード
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-update-password-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="新しいパスワードを入力"
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
            <Controller
              name="password_confirmation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-update-password-password_confirmation">
                    確認用パスワード
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-update-password-password_confirmation"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="確認用パスワードを入力"
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-center">
          <Button type="submit" form="form-update-password">
            送信
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default PasswordUpdateForm;
