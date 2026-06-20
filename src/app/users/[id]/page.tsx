import { UserProfile } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import BackButton from "@/components/back-button";
import UserProfileActionsMenu from "./edit/_components/user-profile-actions-menu";
import { getCurrentUser } from "@/lib/auth";


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
  const loginUser = await getCurrentUser();

  return (
    <div>
      <div className="text-muted-foreground py-3 flex items-center text-sm">
        <BackButton />
      </div>
      <div className="max-w-md w-full mx-auto px-4 pt-4 pb-8 bg-card">
        {Number(id) === loginUser.id && (
          <div className="flex justify-end pb-2">
            <UserProfileActionsMenu id={id} />
          </div>
        )}
        <div className="flex flex-col items-center justify-center gap-4 px-6">
          <h1 className="font-semibold text-lg text-primary-foreground">
            Profile
          </h1>
          <Image
            src={new URL(user.icon_url).pathname}
            alt={`${user.name}のアイコン`}
            width={160}
            height={160}
            priority
            className="rounded-full object-cover shadow-md shadow-black/40"
          />
          <p className="text-lg text-primary-foreground text-shadow-2xs">
            {user.name}
          </p>
          <p className="text-sm text-muted-foreground">{user.profile}</p>
          <p className="text-accent text-shadow-2xs">
            公開日記数:{" "}
            <span className="font-bold">{user.public_diaries_count}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
