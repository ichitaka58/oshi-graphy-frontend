"use client";

import { MessageFormSchema, MessageFormValues } from "@/lib/schemas/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { sendMessage } from "../../actions";
import { unstable_rethrow } from "next/navigation";
import { Field, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";

const MessageForm = ({ id }: { id: number }) => {
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(MessageFormSchema),
    mode: "onSubmit",
    defaultValues: {
      body: "",
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    try {
      const formData = new FormData();
      formData.append("body", data.body);

      const result = await sendMessage(id, formData);
      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof MessageFormValues, {
              message: messages[0],
            });
          }
        } else {
          form.setError("root", { message: result.message });
        }
        return;
      }
      form.reset();
      // setOpen(false);
      // toast.success(result.message, { position: "top-center" });
    } catch (error) {
      // sendMessage内のredirect("/login")はNext.jsがNEXT_REDIRECT例外を
      // throwすることで実現されている。ここで無条件にcatchすると
      // そのリダイレクト用の例外まで握りつぶしてしまうため、
      // redirect/notFound等の例外だけはunstable_rethrowで再送出しNext.jsに処理を戻す。
      unstable_rethrow(error);
      // ここに到達するのは本当の通信エラー等のみ
      form.setError("root", { message: "通信エラーが発生しました" });
    }
  };
  return (
    <div className="mt-1">
      <form id="form-message" onSubmit={form.handleSubmit(onSubmit)}>
        {form.formState.errors.root && (
          <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
            {form.formState.errors.root.message}
          </p>
        )}
        <Controller
          name="body"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <ButtonGroup>
                <Input
                  {...field}
                  id="form-message-input"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "form-message-input-error" : undefined
                  }
                  placeholder="メッセージを入力..."
                  autoComplete="off"
                />
                <Button type="submit" variant="outline" form="form-message">
                  送信
                </Button>
              </ButtonGroup>
              {fieldState.invalid && (
                <FieldError
                  id="form-message-input-error"
                  errors={[fieldState.error]}
                  className="text-xs"
                />
              )}
            </Field>
          )}
        />
      </form>
    </div>
  );
};

export default MessageForm;
