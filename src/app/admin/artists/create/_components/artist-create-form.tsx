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
import {
  ArtistCreateFormSchema,
  ArtistCreateFormValues,
} from "@/lib/schemas/artist";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { createArtist } from "../../actions";
import { toast } from "sonner";
import { unstable_rethrow, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { MicVocal } from "lucide-react";

const ArtistCreateForm = () => {
  const form = useForm<ArtistCreateFormValues>({
    resolver: zodResolver(ArtistCreateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      kana: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: ArtistCreateFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("kana", data.kana);
      const result = await createArtist(formData);

      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof ArtistCreateFormValues, {
              message: messages[0],
            });
          }
        } else {
          form.setError("root", { message: result.message });
        }
        return;
      }
      toast.success(result.message, { position: "top-center" });
      router.push("/admin/artists");
    } catch (error) {
      unstable_rethrow(error);
      form.setError("root", { message: "通信エラーが発生しました" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-center gap-2 py-2 mb-2 font-semibold">
          <MicVocal />
          アーティスト新規登録
        </CardTitle>
      </CardHeader>
      <CardContent className="mb-4">
        <form id="form-create-artist" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          )}
          <FieldGroup>
            {/* アーティスト名 */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-artist-name">
                    アーティスト名
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-artist-name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="アーティスト名を入力..."
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
            {/* よみがな */}
            <Controller
              name="kana"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-artist-kana">
                    よみがな
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-artist-kana"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="ひらがなで入力してください"
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-center">
          <Button type="submit" form="form-create-artist">
            保存
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            クリア
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default ArtistCreateForm;
