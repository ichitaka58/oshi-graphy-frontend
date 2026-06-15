"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginFormSchema, LoginFormValues } from "@/lib/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";


const LoginForm = () => {

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        form.setError("root", {
          message: "メールアドレスまたはパスワードが違います",
        });
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
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader className="flex justify-center">
        <CardTitle className="font-bold">ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <FieldError errors={[form.formState.errors.root]} />
          )}
          <FieldGroup>
            <Controller name="email" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                <Input {...field} id="form-login-email" type="email" aria-invalid={fieldState.invalid} placeholder="メールアドレスを入力" autoComplete="email" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />
            <Controller name="password" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-login-password">Password</FieldLabel>
                <Input {...field} id="form-login-password" type="password" aria-invalid={fieldState.invalid} placeholder="パスワードを入力" autoComplete="current-password" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-center">
          <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
          <Button type="submit" form="form-login">ログイン</Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;


