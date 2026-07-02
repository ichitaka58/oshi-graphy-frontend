"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createComment(
  formData: FormData,
  diaryId: string,
  path: string,
  isReply: boolean,
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(
    !isReply
      ? `${process.env.LARAVEL_API_URL}/api/diaries/${diaryId}/comments`
      : `${process.env.LARAVEL_API_URL}/api/diaries/${diaryId}/comments/reply`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type は指定しない。
        // FormData に画像ファイルが含まれる場合、fetch が自動で
        // "multipart/form-data; boundary=..." を付与する。
        // 手動で指定すると boundary が欠落してバックエンドが解析できなくなる。
      },
      body: formData,
    },
  );
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    return {
      success: false,
      message: `コメントの作成に失敗しました(${res.status})`,
    };
  }
  // キャッシュを無効化→Next.jsが自動で再レンダリング→画面更新
  revalidatePath(path);
  return {
    success: true,
    message: !isReply ? "コメントを投稿しました" : "返信を投稿しました",
  };
}

// コメントの削除処理
export async function deleteComment(commentId: number, path: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    return {
      success: false,
      message: `コメントの削除に失敗しました(${res.status})`,
    };
  }
  revalidatePath(path);
  return {
    success: true,
    message: "コメントを削除しました",
  };
}
