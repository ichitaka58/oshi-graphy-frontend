import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    // Laravel側のログアウトが失敗しても（トークンが既に無効等）、
    // クライアント側は確実にログアウト状態にするためcookieは削除する
    const error = await res.json();
    const response = NextResponse.json(error, { status: res.status });
    response.cookies.delete("token");
    return response;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("token");
  return response;
}
