"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createDiary(formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type は指定しない。
        // FormData に画像ファイルが含まれる場合、fetch が自動で
        // "multipart/form-data; boundary=..." を付与する。
        // 手動で指定すると boundary が欠落してバックエンドが解析できなくなる。
      },
      body: formData,
    });
    if (!res.ok) {
      // 401: cookieのトークンが期限切れまたは無効。再ログインさせる。
      if (res.status === 401) redirect("/login");
      return { success: false, message: `日記の作成に失敗しました(${res.status})` };
    }
  } catch (error) {
    // fetch自体が失敗した場合（ネットワーク断、タイムアウトなど）
    console.error("Error:", error);
    return { success: false, message: "通信エラーが発生しました" };
  }
  redirect("/diaries");
}
