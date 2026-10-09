"use server";

import { ActionResult } from "@/types/action-result";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// メッセージの送信
export async function sendMessage(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/conversations/${id}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      message: `メッセージの送信に失敗しました(${res.status})`,
      errors: errorData.errors as Record<string, string[]> | undefined,
    };
  }
  revalidatePath(`/messages/${id}`);
  revalidatePath("/messages");
  return { success: true };
}

// 会話を既読にする、自分のread_atを更新
export async function markConversationRead(id: number): Promise<ActionResult> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/conversations/${id}/read`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    return {
      success: false,
      message: `会話の既読に失敗しました(${res.status})`,
    };
  }
  revalidatePath("/messages");
  return { success: true };
}

// 会話の作成、取得
export async function startConversation(userId: number): Promise<ActionResult> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/users/${userId}/conversations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    return {
      success: false,
      message: `会話の取得に失敗しました(${res.status})`,
    };
  }
  const { conversation } = await res.json();
  redirect(`/messages/${conversation.id}`);
}

// 未読の会話数を取得
export async function getUnreadConversationCount(): Promise<
  ActionResult<{ unreadCount: number }>
> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/conversations/unread-count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    return {
      success: false,
      message: `未読会話数の取得に失敗しました(${res.status})`,
    };
  }
  const result = await res.json();
  return {
    success: true,
    unreadCount: result.unread_count,
  };
}
