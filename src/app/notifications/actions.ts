"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
