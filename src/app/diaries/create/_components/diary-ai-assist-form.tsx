"use client";

import {
  DiaryAiAssistFormSchema,
  DiaryAiAssistFormValues,
} from "@/lib/schemas/diary";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { suggestDiaryDraft } from "../../actions";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { unstable_rethrow } from "next/navigation";

type DiaryAiAssistFormProps = {
  onCopyReplyToBody: (text: string) => void;
};

const DiaryAiAssistForm = ({ onCopyReplyToBody }: DiaryAiAssistFormProps) => {
  const form = useForm<DiaryAiAssistFormValues>({
    resolver: zodResolver(DiaryAiAssistFormSchema),
    mode: "onSubmit",
    defaultValues: {
      interaction_id: "",
      prompt: "",
    },
  });

  const [reply, setReply] = useState<string>("");
  // 分割代入でisSubmittingを取り出す
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: DiaryAiAssistFormValues) => {
    try {
      const formData = new FormData();

      if (data.interaction_id) {
        formData.append("interaction_id", data.interaction_id);
      }
      formData.append("prompt", data.prompt);

      const result = await suggestDiaryDraft(formData);
      if (!result.success) {
        form.setError("root", { message: result.message });
        return;
      }
      setReply(result.reply);
      // 次の会話のためにGeminiから帰ってくる会話IDをinputタグにセットする
      form.setValue("interaction_id", result.interactionId);
      form.setValue("prompt", "");
    } catch (error){
      // suggestDiaryDraft内のredirect("/login")はNext.jsがNEXT_REDIRECT例外を
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
      {form.formState.errors.root && (
        <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {form.formState.errors.root.message}
        </p>
      )}
      <FieldGroup>
        <Controller
          name="interaction_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                value={field.value ?? ""}
                type="hidden"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-xs" />
              )}
            </Field>
          )}
        />
        <Controller
          name="prompt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-ai-assist-prompt"
                className="font-semibold"
              >
                AIへの相談を入力
              </FieldLabel>
              <Textarea
                {...field}
                id="form-ai-assist-prompt"
                aria-invalid={fieldState.invalid}
                rows={6}
                placeholder="文案作成に必要な情報（日時、場所、アーティスト、感想など）を入力してください"
                className="text-xs placeholder:text-muted-foreground/50 placeholder:text-xs"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-xs" />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Field orientation="horizontal" className="justify-center">
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" />
              AI思考中…
            </>
          ) : (
            "AIに相談"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            setReply("");
          }}
          disabled={isSubmitting}
        >
          会話リセット
        </Button>
      </Field>
      <Field>
        <FieldLabel className="font-semibold">AIの回答</FieldLabel>
        <Card className="py-2 px-2 min-h-16">
          <CardContent className="px-0">
            <p className="text-xs">{reply}</p>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!reply || isSubmitting}
            onClick={() => {
              onCopyReplyToBody(reply);
              setReply("");
            }}
          >
            本文にコピー
          </Button>
        </div>
      </Field>
    </>
  );
};

export default DiaryAiAssistForm;
