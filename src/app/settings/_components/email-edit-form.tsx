"use client";

import { EmailUpdateSchema, EmailUpdateValues } from "@/lib/schemas/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { updateEmail } from "../actions";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "@/components/ui/button";

const EmailEditForm = () => {
  const form = useForm<EmailUpdateValues>({
    resolver: zodResolver(EmailUpdateSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailUpdateValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await updateEmail(formData);
      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof EmailUpdateValues, {
              message: (messages as string[])[0],
            });
          }
        } else {
          form.setError("root", { message: result.message });
        }
        return;
      }
      // router.replace(`/users/${id}`);
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
        <CardTitle className="font-semibold">メールアドレスの変更</CardTitle>
        <CardDescription>
          新しいメールアドレスを入力してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-update-email" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          )}
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-update-email-input">
                    新しいメールアドレス
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-update-email-input"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@example.com"
                    autoComplete="email"
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
          <Button type="submit" form="form-update-email">
            送信
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default EmailEditForm;
