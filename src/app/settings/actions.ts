"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// メースアドレスの変更
export async function updateEmail(formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  formData.append("_method", "PATCH");
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/profile`, {
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
      message: `メールアドレスの更新に失敗しました(${res.status})`,
      errors: errorData.errors,
    };
  }
  return { success: true, message: "メールアドレスを変更しました" };
}

// パスワードの変更
export async function updatePassword(formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  formData.append("_method", "PUT");
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/password`, {
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
      message: `パスワードの変更に失敗しました(${res.status})`,
      errors: errorData.errors,
    };
  }
  return { success: true, message: "パスワードを変更しました" };
}
