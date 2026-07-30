"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createArtist(formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/admin/artists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      message: `アーティストの登録に失敗しました(${res.status})`,
      // TypeScriptに組み込まれているユーティリティ型 Record<キーの型, 値の型>
      errors: errorData.errors as Record<string, string[]> | undefined,
    };
  }
  return {
    success: true,
    message: "アーティストを登録しました",
  };
}
