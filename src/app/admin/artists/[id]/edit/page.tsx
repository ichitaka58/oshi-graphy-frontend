import BackButton from "@/components/back-button";
import { getCurrentUser } from "@/lib/auth";
import { Artist } from "@/types/artist";
import { cookies } from "next/headers";
import { forbidden, notFound, redirect } from "next/navigation";
import ArtistForm from "../../_components/artist-form";

const ArtistEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const loginUser = await getCurrentUser();
  if (!loginUser.is_admin) {
    forbidden();
  }
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/admin/artists/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }
  const fetchData = await res.json();
  const artist: Artist = fetchData.artist;

  return (
    <div>
      <div className="text-muted-foreground py-3 flex items-center text-sm">
        <BackButton />
      </div>
      <div className="w-75 mx-auto mt-4">
        <ArtistForm mode="edit" id={id} artist={artist} />
      </div>
    </div>
  );;
};

export default ArtistEditPage;
