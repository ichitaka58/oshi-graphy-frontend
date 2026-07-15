"use server";

import { DiaryDetailPath, LikeResult } from "@/types/like";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createComment(
  formData: FormData,
  diaryId: string,
  path: DiaryDetailPath,
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
export async function deleteComment(commentId: number, path: DiaryDetailPath) {
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

// コメントへのいいね機能の処理
export async function likeComment(
  commentId: number,
  liked: boolean,
  path: DiaryDetailPath,
): Promise<LikeResult> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/comments/${commentId}/like`,
    {
      method: liked ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  // 401: cookieのトークンが期限切れまたは無効。再ログインさせる。
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    return {
      success: false,
      message: `コメントへのいいねの処理に失敗しました(${res.status})`,
    };
  }
  const result: { liked: boolean; count: number } = await res.json();
  revalidatePath(path);
  return {
    success: true,
    liked: result.liked,
    count: result.count,
  };
}
