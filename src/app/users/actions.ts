"use server";

import { User } from "@/types/user";
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

export async function getFollowers(
  id: string,
  page: number,
): Promise<
  | { success: true; followers: User[]; lastPage: number }
  | { success: false; message: string }
> {
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
): Promise<
  | { success: true; followings: User[]; lastPage: number }
  | { success: false; message: string }
> {
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
