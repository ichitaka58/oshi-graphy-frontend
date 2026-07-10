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
import { Input } from "@/components/ui/input";
import {
  AccountDeleteSchema,
  AccountDeleteValues,
} from "@/lib/schemas/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AccountDeleteForm = () => {
  const form = useForm<AccountDeleteValues>({
    resolver: zodResolver(AccountDeleteSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
    },
  });
  
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const onSubmit = async (data: AccountDeleteValues) => {
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });
      if (!res.ok) {
        const result = await res.json();
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (result.errors) {
          form.setError("password", { message: result.errors.password[0] });
        } else {
          form.setError("root", {message: `アカウントの削除に失敗しました${res.status}`});
        }
        return;
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Delete account Error;", error);
      alert("アカウントの削除に失敗しました");
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
                    <Input
                      {...field}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="パスワード..."
                      autoComplete="current-password"
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
