"use server";

import { ActionResult } from "@/types/action-result";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createArtist(
  formData: FormData,
): Promise<ActionResult<{ message: string }>> {
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

export async function updateArtist(
  id: string,
  formData: FormData,
): Promise<ActionResult<{ message: string }>> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  formData.append("_method", "PUT");
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/admin/artists/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    },
  );
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      message: `アーティストの更新に失敗しました(${res.status})`,
      // TypeScriptに組み込まれているユーティリティ型 Record<キーの型, 値の型>
      errors: errorData.errors as Record<string, string[]> | undefined,
    };
  }
  return {
    success: true,
    message: "アーティスト情報を更新しました",
  };
}

export async function deleteArtist(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/admin/artists/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    return {
      success: false,
      message: `アーティストの削除に失敗しました(${res.status})`,
    };
  }
  return {
    success: true,
    message: "アーティストを削除しました",
  };
}
