"use server";

import { LikePath, LikeResult, LikersResult } from "@/types/like";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function likeDiary(
  id: string,
  liked: boolean,
  path: LikePath,
): Promise<LikeResult> {
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

// いいねユーザー一覧を取得
export async function getLikers(id: string): Promise<LikersResult> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries/${id}/likes`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    // throw new Error("データの取得に失敗しました");
    return {
      success: false,
      message: `いいねしたユーザーの取得に失敗しました(${res.status})`,
    };
  }
  const fetchData = await res.json();
  const likers: User[] = fetchData.likers.data;
  return {
    success: true,
    likers: likers,
  };
}
