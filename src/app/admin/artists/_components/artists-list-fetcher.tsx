import { Artist } from "@/types/artist";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ArtistsList from "./artists-list";
import AppPagination from "@/components/app-pagination";

const ArtistsListFetcher = async ({ page }: { page: string }) => {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/admin/artists?page=${page}`,
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
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }
  const fetchData = await res.json();
  const artists: Artist[] = fetchData.artists.data;
  const currentPage: number = fetchData.artists.current_page;
  const lastPage: number = fetchData.artists.last_page;
  const from: number = fetchData.artists.from; // そのページの先頭要素が全体の何番目か

  return (
    <>
      <ArtistsList artists={artists} from={from} />
      <AppPagination currentPage={currentPage} lastPage={lastPage} />
    </>
  );
};

export default ArtistsListFetcher;
