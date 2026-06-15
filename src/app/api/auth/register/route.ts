import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Laravel のエラー内容（バリデーションエラーなど）をそのままブラウザに返す
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }

  // res.json() で body をパースし、access_token だけを取り出す
  const { access_token } = await res.json();

  // ブラウザへのレスポンスは { ok: true } のみ。access_token は渡さない。
  const response = NextResponse.json({ ok: true });
  // access_token は httpOnly Cookie に保存する。JS からは読めず、リクエスト時に自動送信される。
  response.cookies.set("token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 本番環境では HTTPS のみ
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7日
  });
  return response;
}
