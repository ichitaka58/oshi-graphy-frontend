"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { searchArtists } from "@/app/artists/actions";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DiaryUpdateFormSchema,
  DiaryUpdateFormValues,
} from "@/lib/schemas/diary";
import { Artist } from "@/types/artist";
import { updateDiary } from "@/app/diaries/actions";
import { DiaryEditItem } from "@/types/diary";
import { Checkbox } from "@/components/ui/checkbox";
import { toDateInputValue } from "@/lib/date";
import { useRouter, unstable_rethrow } from "next/navigation";
import { toast } from "sonner";

type Props = {
  id: string;
  diary: DiaryEditItem;
};

const DiaryEditForm = ({ id, diary }: Props) => {
  const form = useForm<DiaryUpdateFormValues>({
    resolver: zodResolver(DiaryUpdateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      happened_on: toDateInputValue(diary.happened_on), // yyyy-MM-dd形式に変換
      artist_id: diary.artist_id,
      body: diary.body,
      images: [],
      is_public: diary.is_public,
      delete_images: [],
    },
  });

  const router = useRouter();

  // ファイル入力は value を React state で制御できないため、
  // リセット時に imperatively クリアするために ref を保持する
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string[]>([]);
  // watch はフォームの値を監視し、変化のたびに再レンダーを起こす。
  // 初回レンダー前は undefined を返す可能性があるため ?? [] でガードして
  // 後続の useEffect 内での map を安全に実行できるようにする。
  const imageFiles = form.watch("images") ?? [];
  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrl(urls);
    // Object URL は GC されないため、imageFiles が変わるたびに手動解放してメモリリークを防ぐ
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles]);

  const [query, setQuery] = useState<string>("");
  const [artists, setArtists] = useState<Artist[]>([diary.artist]);
  // 選択後に artists（検索結果）が変わっても名前を表示し続けるため別 state で保持する
  const [selectedArtistName, setSelectedArtistName] = useState<string>(
    diary.artist.name,
  );

  // 入力のたびに API を叩かないよう 300ms デバウンスする
  useEffect(() => {
    if (query.length < 1) return;
    const timer = setTimeout(async () => {
      const results = await searchArtists(query);
      setArtists(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const onSubmit = async (data: DiaryUpdateFormValues) => {
    try {
      // ファイルを含むため JSON ではなく FormData で送信する
      const formData = new FormData();
      formData.append("happened_on", data.happened_on);
      formData.append("artist_id", String(data.artist_id));
      formData.append("body", data.body);
      // FormData は文字列しか扱えないため boolean を "1"/"0" に変換する
      formData.append("is_public", data.is_public ? "1" : "0");
      // Laravel の配列フィールドは "images[]" というキー名で受け取る
      data.images?.forEach((file) => formData.append("images[]", file));
      // 既存画像を削除する場合のフィールド
      data.delete_images?.forEach((imageId) =>
        formData.append("delete_images[]", String(imageId)),
      );

      /// 成功時は トースト表示＆/diariesへ遷移、失敗時はフォームにエラー表示
      const result = await updateDiary(id, formData);
      if (!result.success) {
        form.setError("root", { message: result.message });
        return;
      }
      toast.success(result.message, {
        position: "top-center",
      });
      router.push("/diaries");
    } catch (error) {
      // updateDiary内のredirect("/login")はNext.jsがNEXT_REDIRECT例外を
      // throwすることで実現されている。ここで無条件にcatchすると
      // そのリダイレクト用の例外まで握りつぶしてしまうため、
      // redirect/notFound等の例外だけはunstable_rethrowで再送出しNext.jsに処理を戻す。
      unstable_rethrow(error);
      // ここに到達するのは本当の通信エラー等のみ
      form.setError("root", { message: "通信エラーが発生しました" });
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="flex justify-center">
        <CardTitle className="font-semibold">日記編集</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-update-diary" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          )}
          <FieldGroup>
            {/* 日付 */}
            <Controller
              name="happened_on"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-update-diary-happened_on"
                    className="font-semibold"
                  >
                    日付
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-update-diary-happened_on"
                    type="date"
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
            {/* アーティスト */}
            <Controller
              name="artist_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel
                      htmlFor="form-update-diary-artist_id"
                      className="font-semibold"
                    >
                      アーティスト
                    </FieldLabel>
                  </FieldContent>
                  {/*
                    items ではなく filteredItems を使う理由:
                    items を渡すと base-ui がクライアント側でさらにフィルタリングしてしまう。
                    サーバー検索済みの結果をそのまま表示するために filteredItems を使う。
                  */}
                  <Combobox
                    filteredItems={artists}
                    name={field.name}
                    value={field.value > 0 ? field.value : null}
                    onValueChange={(value) => {
                      if (value) {
                        const artist = artists.find((a) => a.id === value);
                        // 選択時点の名前を保存しておく（itemToStringLabel で使用）
                        setSelectedArtistName(artist?.name ?? "");
                        field.onChange(value);
                      } else {
                        setSelectedArtistName("");
                        field.onChange(0);
                      }
                    }}
                    onInputValueChange={(value, details) => {
                      // アイテム選択時にも onInputValueChange が発火するため reason で絞る。
                      // "input-change" 以外（"item-press" 等）でも setQuery すると
                      // 選択直後に id の文字列で検索が走り、選択が崩れる。
                      if (details.reason === "input-change") {
                        setQuery(value);
                      }
                    }}
                    // value は artist.id（number）のため、そのままでは id 文字列がインプットに表示される。
                    // itemToStringLabel で選択後のインプット表示を名前に上書きする。
                    itemToStringLabel={() => selectedArtistName}
                  >
                    <ComboboxInput
                      placeholder="アーティストを選択"
                      id="form-update-diary-artist_id"
                      aria-invalid={fieldState.invalid}
                      showClear
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>アーティストが存在しません</ComboboxEmpty>
                      <ComboboxList>
                        {(item: Artist) => (
                          <ComboboxItem key={item.id} value={item.id}>
                            {item.name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-xs"
                    />
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
                  <FieldLabel
                    htmlFor="form-update-diary-body"
                    className="font-semibold"
                  >
                    本文
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-update-diary-body"
                    aria-invalid={fieldState.invalid}
                    rows={6}
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
            {/* 写真 */}
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-update-diary-images"
                    className="font-semibold"
                  >
                    写真
                  </FieldLabel>
                  <Input
                    id="form-update-diary-images"
                    type="file"
                    accept="image/*"
                    aria-invalid={fieldState.invalid}
                    multiple
                    name={field.name}
                    ref={(el) => {
                      field.ref(el);
                      imageInputRef.current = el;
                    }}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      const files = e.target.files;
                      field.onChange(files ? Array.from(files) : []);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  {/* 写真のプレビュー表示 */}
                  {previewUrl.length > 0 && (
                    <div className="grid grid-cols-2 gap-1">
                      {previewUrl.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`preview-${index}`}
                          className="h-24 w-full object-cover"
                        />
                      ))}
                    </div>
                  )}
                </Field>
              )}
            />
            {/* 既存写真の表示 */}
            {diary.images.length > 0 ? (
              <Controller
                name="delete_images"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLegend variant="label" className="font-semibold">
                      登録済みの写真
                    </FieldLegend>
                    <FieldDescription>削除したい写真を選択</FieldDescription>
                    <FieldGroup
                      data-slot="checkbox-group"
                      className="grid grid-cols-2 gap-1"
                    >
                      {diary.images.map((image) => (
                        <Field
                          key={image.id}
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <Checkbox
                            id={`form-update-diary-delete_images-${image.id}`}
                            name={field.name}
                            aria-invalid={fieldState.invalid}
                            checked={field.value?.includes(image.id)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value ?? []), image.id]
                                : field.value?.filter(
                                    (value) => value !== image.id,
                                  );
                              field.onChange(newValue);
                            }}
                          />
                          <FieldLabel
                            htmlFor={`form-update-diary-delete_images-${image.id}`}
                          >
                            <img
                              src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${image.path}`}
                              alt={`existing image-${image.id}`}
                              className="h-24 object-cover"
                            />
                          </FieldLabel>
                        </Field>
                      ))}
                    </FieldGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />
            ) : (
              <p className="text-gray-500">この日記に写真はありません。</p>
            )}

            {/* 公開設定 */}
            <Controller
              name="is_public"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel
                      htmlFor="form-update-diary-is_public"
                      className="font-semibold"
                    >
                      公開する
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id="form-update-diary-is_public"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="data-checked:bg-[#F8DE6F]"
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-center">
          <Button type="submit" form="form-update-diary">
            保存
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              if (imageInputRef.current) {
                imageInputRef.current.value = "";
              }
            }}
          >
            クリア
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default DiaryEditForm;
