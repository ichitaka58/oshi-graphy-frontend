"use server";

import { ActionResult } from "@/types/action-result";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateUserProfile(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  formData.append("_method", "PUT");
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/user_profile`, {
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
      message: `プロフィールの更新に失敗しました(${res.status})`,
      errors: errorData.errors as Record<string, string[]> | undefined,
    };
  }
  revalidatePath(`/users/${id}`);
  return { success: true };
}

export async function toggleUserFollow(
  id: string,
  currentlyFollowing: boolean,
): Promise<
  ActionResult<{
    following: boolean;
    followingsCount: number;
    followersCount: number;
  }>
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
  revalidatePath(`/users/${id}`);
  return {
    success: true,
    following: result.following,
    followingsCount: result.followings_count,
    followersCount: result.followers_count,
  };
}

export async function getFollowers(
  id: string,
  page: number,
): Promise<ActionResult<{ followers: User[]; lastPage: number }>> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/users/${id}/followers?page=${page}`,
    {
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
      message: `フォロワーユーザーの取得に失敗しました(${res.status})`,
    };
  }
  const fetchData = await res.json();
  const followers: User[] = fetchData.followers.data;
  const lastPage: number = fetchData.followers.last_page;
  return {
    success: true,
    followers: followers,
    lastPage: lastPage,
  };
}

export async function getFollowings(
  id: string,
  page: number,
): Promise<ActionResult<{ followings: User[]; lastPage: number }>> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/users/${id}/followings?page=${page}`,
    {
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
      message: `フォローユーザーの取得に失敗しました(${res.status})`,
    };
  }
  const fetchData = await res.json();
  const followings: User[] = fetchData.followings.data;
  const lastPage: number = fetchData.followings.last_page;
  return {
    success: true,
    followings: followings,
    lastPage: lastPage,
  };
}

export async function toggleUserBlock(
  userId: string,
  currentlyBlocking: boolean,
): Promise<ActionResult<{ blocking: boolean }>> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/users/${userId}/block`,
    {
      method: currentlyBlocking ? "DELETE" : "POST",
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
      message: `ブロック／ブロック解除に失敗しました(${res.status})`,
    };
  }
  const result = await res.json();
  revalidatePath(`/users/${userId}`);
  return {
    success: true,
    blocking: result.blocking,
  };
}
