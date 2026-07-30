"use client";

import {
  ArtistCreateFormSchema,
  ArtistCreateFormValues,
} from "@/lib/schemas/artist";
import { Artist } from "@/types/artist";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateArtist } from "../../../actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MicVocal } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ArtistEditForm = ({ id, artist }: { id: string; artist: Artist }) => {
  const form = useForm<ArtistCreateFormValues>({
    resolver: zodResolver(ArtistCreateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: artist.name,
      kana: artist.kana,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: ArtistCreateFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("kana", data.kana);
      const result = await updateArtist(id, formData);

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
          アーティスト情報編集
        </CardTitle>
      </CardHeader>
      <CardContent className="mb-4">
        <form id="form-edit-artist" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FieldLabel htmlFor="form-edit-artist-name">
                    アーティスト名
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-artist-name"
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
                  <FieldLabel htmlFor="form-edit-artist-kana">
                    よみがな
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-artist-kana"
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
          <Button type="submit" form="form-edit-artist">
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

export default ArtistEditForm;
