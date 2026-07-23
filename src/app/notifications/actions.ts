"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ひとつの通知を既読にする
export async function markRead(
  id: string,
): Promise<{ success: true } | { success: false; message: string }> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/notifications/${id}/read`,
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
      message: `通知を既読にすることができませんでした(${res.status})`,
    };
  }
  return { success: true };
}

// 全ての通知を一括で既読にする
export async function markAllRead(): Promise<
  { success: true } | { success: false; message: string }
> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/notifications/mark-all-read`,
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
      message: `通知を既読にすることができませんでした(${res.status})`,
    };
  }
  revalidatePath("/notifications");
  return { success: true };
}

// 通知の削除
export async function deleteNotification(
  id: string,
): Promise<{ success: true } | { success: false; message: string }> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/notifications/${id}`,
    {
      method: "DELETE",
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
      message: `通知を削除できませんでした(${res.status})`,
    };
  }
  revalidatePath("/notifications");
  return { success: true };
}

// 未読件数の取得
export async function getUnreadCount(): Promise<
  { success: true; unreadCount: number } | { success: false; message: string }
> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/notifications/unread-count`,
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
      message: `未読件数を取得することができませんでした(${res.status})`,
    };
  }
  const result = await res.json();
  return { success: true, unreadCount: result.count };
}

// 既読通知を未読にする
export async function markUnread(
  id: string,
): Promise<{ success: true } | { success: false; message: string }> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/notifications/${id}/mark-unread`,
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
      message: `通知を未読にすることができませんでした(${res.status})`,
    };
  }
  return { success: true };
}
