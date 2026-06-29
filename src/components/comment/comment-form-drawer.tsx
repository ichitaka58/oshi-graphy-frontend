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

const CommentFormDrawer = ({ diaryId, path }: { diaryId: string, path: string }) => {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentFormSchema),
    mode: "onSubmit",
    defaultValues: {
      body: "",
    },
  });

  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = async (data: CommentFormValues) => {
    const formData = new FormData();
    formData.append("body", data.body);

    const result = await createComment(formData, diaryId, path);
    if (result && !result.success) {
      form.setError("root", { message: result.message });
    } else {
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="p-0"
          onClick={(e) => e.currentTarget.blur()}
          title="コメント作成"
        >
          <MessageCirclePlus size={14} className="text-accent/80" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-72 mx-auto px-6" aria-describedby={undefined}>
        <DrawerHeader>
          <DrawerTitle className="text-sm">コメントを入力</DrawerTitle>
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

        <DrawerFooter>
          <Button type="submit" form="form-comment">
            投稿
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
