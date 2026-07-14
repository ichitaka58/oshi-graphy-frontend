"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LikeResult =
  | { success: true; liked: boolean; count: number }
  | { success: false; message: string };

export async function likeDiary(id: string, liked: boolean, path: string): Promise<LikeResult> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/diaries/${id}/like`,
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
      message: `いいねの処理に失敗しました(${res.status})`,
    };
  }
  const result: { liked: boolean; count: number } = await res.json();
  // revalidatePath(`/public-diaries/${id}`);
  revalidatePath(path);
  return {
    success: true,
    liked: result.liked,
    count: result.count,
  };
}
