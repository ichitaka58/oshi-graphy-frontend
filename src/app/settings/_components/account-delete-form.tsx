"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  AccountDeleteSchema,
  AccountDeleteValues,
} from "@/lib/schemas/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { deleteAccount } from "../actions";

const AccountDeleteForm = () => {
  const form = useForm<AccountDeleteValues>({
    resolver: zodResolver(AccountDeleteSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
    },
  });

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  // パスワード表示、非表示の切り替え
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (data: AccountDeleteValues) => {
    try {
      const result = await deleteAccount(data.password);
      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof AccountDeleteValues, {
              message: messages[0],
            });
          }
        } else {
          form.setError("root", { message: result.message });
        }
        return;
      }
      window.location.href = "/";
    } catch (error) {
      // deleteAccount内のredirect("/login")はNext.jsがNEXT_REDIRECT例外を
      // throwすることで実現されている。ここで無条件にcatchすると
      // そのリダイレクト用の例外まで握りつぶしてしまうため、
      // redirect/notFound等の例外だけはunstable_rethrowで再送出しNext.jsに処理を戻す。
      unstable_rethrow(error);
      // ここに到達するのは本当の通信エラー等のみ
      form.setError("root", { message: "通信エラーが発生しました" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">アカウントの削除</CardTitle>
          <CardDescription className="text-xs">
            アカウントを削除すると、すべてのデータとファイルも完全に削除されます。アカウントを削除する前に必要なデータがあれば事前にダウンロードしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setAlertOpen(true)}>
            アカウントを削除する
          </Button>
        </CardContent>
      </Card>

      {/* アカウント削除確認ダイアログ */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              ❗️本当にアカウントを削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              アカウントを完全に削除するには、パスワードを入力してください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form id="form-delete-account" onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.errors.root && (
              <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
                {form.formState.errors.root.message}
              </p>
            )}
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="form-delete-account-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.invalid
                            ? "form-delete-account-password-error"
                            : undefined
                        }
                        placeholder="パスワード..."
                        autoComplete="current-password"
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground/80"
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        id="form-delete-account-password-error"
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }}
            >
              アカウント削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountDeleteForm;
