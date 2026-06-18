import { UserProfile } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";


const UserProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    throw new Error("ユーザーデータの取得に失敗しました");
  }

  const data = await res.json();
  const user: UserProfile = data.user;

  return (
    <div className="max-w-md w-full mx-auto flex flex-col items-center justify-center gap-4 px-10 py-8 mt-8 bg-card">
      <h1 className="font-semibold text-lg text-primary-foreground">Profile</h1>
      <Image
        src={new URL(user.icon_url).pathname}
        alt={`${user.name}のアイコン`}
        width={160}
        height={160}
        className="rounded-full object-cover shadow-md shadow-black/40" />
      <p className="text-lg text-primary-foreground text-shadow-2xs">{user.name}</p>
      <p className="text-sm text-muted-foreground">{user.profile}</p>
      <p className="text-accent text-shadow-2xs">公開日記数: <span className="font-bold">{user.public_diaries_count}</span></p>
    </div>
  );
};

export default UserProfilePage;
