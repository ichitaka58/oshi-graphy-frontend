import { User } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ヘッダーページで使用
export async function getCurrentUserOrNull ():Promise<User | null> {
  const token = (await cookies()).get("token")?.value;
  if(!token) return null;

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store", // ユーザー情報はキャッシュしない
  });
  if(!res.ok) return null;

  // const user: User = await res.json();
  return res.json();

}

// 認証必須のページで使用
export async function getCurrentUser ():Promise<User> {
  const user = await getCurrentUserOrNull();
  if(!user) {
    redirect("/login");
  }

  // const token = (await cookies()).get("token")?.value;
  // if(!token) {
  //   redirect("/login");
  // }
  // const res = await fetch(`${process.env.LARAVEL_API_URL}/api/user`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     Accept: "application/json",
  //   },
  //   cache: "no-store", // ユーザー情報はキャッシュしない
  // });
  // if(!res.ok) {
  //   redirect("/login");
  // }
  // const user: User = await res.json();
  return user;

}