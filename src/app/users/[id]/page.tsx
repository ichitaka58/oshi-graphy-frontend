import { UserProfile } from "@/types/user";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import BackButton from "@/components/back-button";
import UserProfileActionsMenu from "./edit/_components/user-profile-actions-menu";
import { getCurrentUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserFollowSection from "./_components/user-follow-section";

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  // ユーザーデータ取得とログインユーザー取得は互いに依存しないため並列実行する
  const [res, loginUser] = await Promise.all([
    fetch(`${process.env.LARAVEL_API_URL}/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }),
    getCurrentUser(), // 認証チェック
  ]);
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("ユーザーデータの取得に失敗しました");
  }

  const data = await res.json();
  const user: UserProfile = data.user;
  const isFollowing: boolean = data.is_following; // ログインユーザーがこのユーザーをフォローしているか？
  const isBlocking: boolean = data.is_blocking; // ログインユーザーがこのユーザーをブロックしているか？

  return (
    <div>
      <BackButton />
      <div className="max-w-md w-full mx-auto px-4 pt-4 pb-8 bg-card text-card-foreground">
        <div className="flex justify-end pb-2">
          <UserProfileActionsMenu
            userId={id}
            loginUserId={loginUser.id}
            initialIsBlocking={isBlocking}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 px-6">
          <h1 className="font-semibold text-lg">Profile</h1>
          <Avatar className="size-40 shadow-md shadow-black/40 dark:shadow-primary/10">
            <AvatarImage
              src={
                user.icon_path
                  ? `/storage/${user.icon_path}`
                  : "/images/icon_placeholder.png"
              }
              alt={`${user.name}のアイコン`}
            />
            <AvatarFallback>OG</AvatarFallback>
          </Avatar>
          <p className="text-lg text-shadow-2xs">{user.name}</p>
          {/* ユーザーフォローボタン、フォロー・フォロワー数 */}
          <UserFollowSection
            key={id}
            id={id}
            initialFollowingsCount={user.followings_count}
            initialFollowersCount={user.followers_count}
            initialIsFollowing={isFollowing}
            showFollowButton={Number(id) !== loginUser.id && !isBlocking}
          />
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
