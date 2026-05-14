import { NextResponse } from "next/server";

export async function POST (request: Request) {
  const body = await request.json();

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  });
  if(!res.ok) {
    const error =await res.json();
    return NextResponse.json(error, { status: res.status });
  }
  const { access_token } = await res.json();

  const response = NextResponse.json({ ok: true })
  response.cookies.set("token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7日
  });
  return response;
}