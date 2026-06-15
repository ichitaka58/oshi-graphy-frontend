import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = (await cookies()).get("token")?.value;
    if (!token) {
      redirect("/login");
    }
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("token");
  return response;
}
