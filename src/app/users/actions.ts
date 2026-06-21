"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateUserProfile(id: string, formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  formData.append("_method", "PUT");
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/user_profile`, {
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
      message: `プロフィールの更新に失敗しました(${res.status})`,
    };
  }
  // redirect(`/users/${id}`);
  return { success:true};

}
