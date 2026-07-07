"use server";

import { Artist } from "@/types/artist";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

export async function searchArtists(query: string): Promise<Artist[]> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  try {
    const res = await fetch(
      `${process.env.LARAVEL_API_URL}/api/artists/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      return [];
    }
    return res.json();
  } catch (error) {
    // 401時のredirect("/login")はこのtryブロック内で呼ばれており、
    // Next.jsがNEXT_REDIRECT例外をthrowすることで実現されている。
    // 無条件にcatchするとそのリダイレクト用の例外まで握りつぶしてしまうため、
    // redirect/notFound等の例外だけはunstable_rethrowで再送出しNext.jsに処理を戻す。
    unstable_rethrow(error);
    console.error("Error:", error);
    return [];
  }
}
