"use client";

import {
  DiaryCreateFormSchema,
  DiaryCreateFormValues,
} from "@/lib/schemas/diary";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { createDiary } from "../../actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const DiaryCreateForm = () => {
  const form = useForm<DiaryCreateFormValues>({
    resolver: zodResolver(DiaryCreateFormSchema),
    mode: "onBlur",
    defaultValues: {
      happened_on: "",
      artist_id: 0,
      body: "",
      is_public: false,
    },
  });

  // onSubmitに修正する
  const onSubmit = async (data: DiaryCreateFormValues) => {
    const formData = new FormData();
    formData.append("happened_on", data.happened_on);
    formData.append("artist_id", String(data.artist_id));
    formData.append("body", data.body);
    formData.append("is_public", data.is_public ? "1" : "0");
    data.images?.forEach((file) => formData.append("images[]", file));

    const result = await createDiary(formData);
    if (result && !result.success) {
      form.setError("root", { message: result.message });
    }
  };
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>日記作成</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-create-diary" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* 日付 */}
            <Controller
              name="happened_on"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-diary-happened_on">
                    日付
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-diary-happened_on"
                    type="date"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* アーティスト */}
            <Controller
              name="artist_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-create-diary-artist_id">
                      アーティスト
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-create-diary-artist_id"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="--アーティストを選択--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">森高千里</SelectItem>
                      <SelectItem value="10">DREAM COME TRUE</SelectItem>
                      <SelectItem value="12">伊藤蘭</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* 本文 */}
            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-diary-body">本文</FieldLabel>
                  <Textarea
                    {...field}
                    id="form-create-diary-body"
                    aria-invalid={fieldState.invalid}
                    rows={6}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* 写真 */}
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-crete-diary-images">
                    写真
                  </FieldLabel>
                  <Input
                    id="form-crete-diary-images"
                    type="file"
                    accept="image/*"
                    aria-invalid={fieldState.invalid}
                    multiple
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      const files = e.target.files;
                      field.onChange(files ? Array.from(files) : []);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* 公開設定 */}
            <Controller
              name="is_public"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet>
                  <FieldLegend variant="label">公開設定</FieldLegend>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-create-diary-is_public">
                        公開する
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Switch
                      id="form-create-diary-is_public"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                </FieldSet>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            クリア
          </Button>
          <Button type="submit" form="form-create-diary">
            保存
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default DiaryCreateForm;
