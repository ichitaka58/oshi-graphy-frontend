import { cookies } from "next/headers";
import DiaryEditForm from "./_components/diary-edit-form";
import { notFound, redirect } from "next/navigation";
import { DiaryEditItem } from "@/types/diary";
import BackButton from "@/components/back-button";

const DiaryEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }
  const data = await res.json();
  const diary: DiaryEditItem = data.diary;

  return (
    <div>
      <div className="text-muted-foreground py-3 flex items-center text-sm">
        <BackButton />
      </div>
      <div className="w-75 mx-auto mt-4">
        <DiaryEditForm id={id} diary={diary} />
      </div>
    </div>
  );
};

export default DiaryEditPage;
