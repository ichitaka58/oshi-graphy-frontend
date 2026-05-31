"use server";

import { Artist } from "@/types/artist";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    console.error("Error:", error);
    return [];
  }
}
