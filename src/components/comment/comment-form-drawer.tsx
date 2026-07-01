"use client";

import { MessageCirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Textarea } from "../ui/textarea";
import { CommentFormSchema, CommentFormValues } from "@/lib/schemas/comment";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createComment } from "./actions";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { useState } from "react";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const CommentFormDrawer = ({
  diaryId,
  path,
  isReply,
  parentId,
  commentUserName,
}: {
  diaryId: string;
  path: string;
  isReply: boolean;
  parentId?: number;
  commentUserName?: string;
}) => {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentFormSchema),
    mode: "onSubmit",
    defaultValues: {
      body: "",
      parent_id: parentId,
    },
  });

  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = async (data: CommentFormValues) => {
    const formData = new FormData();
    formData.append("body", data.body);
    if (data.parent_id !== undefined) {
      formData.append("parent_id", String(data.parent_id));
    }

    const result = await createComment(formData, diaryId, path, isReply);
    if (result && !result.success) {
      form.setError("root", { message: result.message });
    } else {
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {!isReply ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="p-0"
                onClick={(e) => e.currentTarget.blur()}
              >
                <MessageCirclePlus size={14} className="text-accent/80" />
              </Button>
            </DrawerTrigger>
          </TooltipTrigger>
          <TooltipContent className="text-[10px]">
            <p>コメント作成</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <DrawerTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.currentTarget.blur()}
            className="cursor-pointer"
          >
            -返信-
          </button>
        </DrawerTrigger>
      )}
      <DrawerContent className="w-72 mx-auto px-6" aria-describedby={undefined}>
        <DrawerHeader>
          <DrawerTitle className="text-sm font-semibold">
            {!isReply ? "コメント" : "コメント返信"}
          </DrawerTitle>
        </DrawerHeader>
        <form id="form-comment" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          )}
          <FieldGroup>
            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="text-xs"
                    placeholder={
                      !isReply
                        ? "コメントを入力..."
                        : `${commentUserName} への返信を入力...`
                    }
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
            {/* コメント返信の時、親コメントのid(parent_id)を渡す必要 */}
            {isReply && (
              <Controller
                name="parent_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      type="hidden"
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
            )}
          </FieldGroup>
        </form>

        <DrawerFooter>
          <Button type="submit" form="form-comment">
            {!isReply ? "コメントする" : "返信する"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentFormDrawer;
