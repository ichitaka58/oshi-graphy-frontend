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
  return { success: true };
}

export async function toggleUserFollow(
  id: string,
  currentlyFollowing: boolean,
): Promise<
  | {
      success: true;
      following: boolean;
      followingsCount: number;
      followersCount: number;
    }
  | { success: false; message: string }
> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/users/${id}/follow`,
    {
      method: currentlyFollowing ? "DELETE" : "POST",
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
      message: `フォローに失敗しました(${res.status})`,
    };
  }
  const result = await res.json();
  return {
    success: true,
    following: result.following,
    followingsCount: result.followings_count,
    followersCount: result.followers_count,
  };
}
