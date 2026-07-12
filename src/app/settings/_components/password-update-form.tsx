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
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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

  // パスワード表示、非表示の切り替えを管理するstate
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false);

  const onSubmit = async (data: PasswordUpdateValues) => {
    try {
      const formData = new FormData();
      formData.append("current_password", data.current_password);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      const result = await updatePassword(formData);
      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof PasswordUpdateValues, {
              message: (messages as string[])[0],
            });
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
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-update-password-current_password"
                      type={showCurrentPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="現在のパスワードを入力"
                      autoComplete="current-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="text-muted-foreground/80"
                      >
                        {showCurrentPassword ? <Eye /> : <EyeOff />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
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
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-update-password-password"
                      type={showNewPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="新しいパスワードを入力"
                      autoComplete="new-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-muted-foreground/80"
                      >
                        {showNewPassword ? <Eye /> : <EyeOff />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
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
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-update-password-password_confirmation"
                      type={showPasswordConfirmation ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="確認用パスワードを入力"
                      autoComplete="new-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordConfirmation(!showPasswordConfirmation)
                        }
                        className="text-muted-foreground/80"
                      >
                        {showPasswordConfirmation ? <Eye /> : <EyeOff />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
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
