import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/profile`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("token");
  return response;
}
