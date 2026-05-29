"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createDiary(formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if(!token) {
    redirect("/login"); // tokenがなければログインへ
  }
  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
      body: formData,
    });
    if(!res.ok) {
      return { success: false, message: `日記の作成に失敗しました(${res.status})` };
    }
  } catch (error) {
      console.error("Error:", error);
      return { success: false, message: "通信エラーが発生しました"};
  }
  redirect("/diaries");
}
