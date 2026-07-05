"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 日記の登録処理
export async function createDiary(formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
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

  // 401: cookieのトークンが期限切れまたは無効。再ログインさせる。
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    return {
      success: false,
      message: `日記の作成に失敗しました(${res.status})`,
    };
  }
  return {
    success: true,
    message: "日記を保存しました",
  };
}

// 日記の更新処理
export async function updateDiary(id: string, formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  formData.append("_method", "PUT");
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    return {
      success: false,
      message: `日記の更新に失敗しました(${res.status})`,
    };
  }
  revalidatePath("/diaries");
  return {
    success: true,
    message: "日記を更新しました",
  };
}

// 日記の削除処理
export async function deleteDiary(id: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    return {
      success: false,
      message: `日記の削除に失敗しました(${res.status})`,
    };
  }
  return {
    success: true,
    message: "日記を削除しました",
  };
}

// GeminiによるAI日記文案の作成
export async function suggestDiaryDraft(formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/ai/diary-suggest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );
  if (!res.ok) {
    return {
      success: false,
      message: `AIの文案作成に削除に失敗しました(${res.status})。短い入力で試してください`,
    };
  }
  const result = await res.json();
  return {
    success: true,
    reply: result.reply,
    interactionId: result.interaction_id,
  };
}
