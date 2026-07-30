import AppPagination from "@/components/app-pagination";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import ArtistsList from "./_components/artists-list";
import { Artist } from "@/types/artist";
import BackButton from "@/components/back-button";

const AdminArtistsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const loginUser = await getCurrentUser();
  if (!loginUser.is_admin) {
    forbidden();
  }
  const { page = "1" } = await searchParams;
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
      <div className="text-muted-foreground py-3 flex items-center text-sm">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto pt-6 px-2">
        <h1 className="text-center mb-4 text-2xl text-foreground font-extrabold">
          登録済みアーティスト一覧
        </h1>
        <div className="w-full p-4 bg-card text-card-foreground">
          <ArtistsList artists={artists} from={from} />
          {/* <Suspense fallback={<PublicDiarySkeleton />}>
        <PublicDiariesList searchParams={searchParams} />
      </Suspense> */}
          <AppPagination currentPage={currentPage} lastPage={lastPage} />
        </div>
      </div>
    </>
  );
};

export default AdminArtistsPage;
