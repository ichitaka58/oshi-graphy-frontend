"use client";

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
import { RegisterFormSchema, RegisterFormValues } from "@/lib/schemas/register";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

const RegisterForm = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errors) {
          for (const [field, messages] of Object.entries(errorData.errors)) {
            form.setError(field as keyof RegisterFormValues, {
              message: (messages as string[])[0],
            });
          }
        } else {
          form.setError("root", { message: "登録ができませんでした" });
        }
        return;
      }
      window.location.href = "/diaries";
    } catch (error) {
      console.error("Error:", error);
      form.setError("root", { message: "通信エラーが発生しました" });
    }
    form.reset();
  };

  return (
    <Card className="w-full sm:max-w-md max-auto">
      <CardHeader className="flex justify-center">
        <CardTitle className="font-bold">新規登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <FieldError errors={[form.formState.errors.root]} />
          )}
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-name">名前</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="名前を入力"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="メールアドレスを入力"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-register-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="パスワードを入力"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password_confirmation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-password_confirmation">
                    Passwordの確認
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-register-password_confirmation"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="確認用パスワードを入力"
                    autoComplete="new-password"
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
      <CardFooter className="flex-col gap-2">
        <Field orientation="horizontal" className="justify-center">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-register">
            新規登録
          </Button>
        </Field>
        <Field orientation="horizontal" className="justify-center">
          <p className="text-xs text-muted-foreground/80">
            登録済みの方は
            <Link href="/login" className="underline">
              こちら
            </Link>
          </p>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
