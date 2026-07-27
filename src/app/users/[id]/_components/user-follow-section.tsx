"use client";

import { Button } from "@/components/ui/button";
import { toggleUserFollow } from "../../actions";
import { toast } from "sonner";
import { unstable_rethrow } from "next/navigation";
import { useState } from "react";
import FollowersListDrawer from "./followers-list-drawer";
import FollowingsListDrawer from "./followings-list-drawer";

type Props = {
  id: string;
  initialFollowingsCount: number;
  initialFollowersCount: number;
  initialIsFollowing: boolean;
  showFollowButton: boolean;
};

const UserFollowSection = ({
  id,
  initialFollowingsCount,
  initialFollowersCount,
  initialIsFollowing,
  showFollowButton,
}: Props) => {
  const [followingsCount, setFollowingsCount] = useState<number>(
    initialFollowingsCount,
  );
  const [followersCount, setFollowersCount] = useState<number>(
    initialFollowersCount,
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing);
  const [busy, setBusy] = useState<boolean>(false);

  const handleToggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await toggleUserFollow(id, isFollowing);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      setFollowingsCount(result.followingsCount);
      setFollowersCount(result.followersCount);
      setIsFollowing(result.following);
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {showFollowButton && (
        <Button
          type="button"
          variant={isFollowing ? "outline" : "default"}
          onClick={handleToggle}
          disabled={busy}
          className="hover:bg-primary/70"
        >
          {isFollowing ? "フォロー中" : "フォロー"}
        </Button>
      )}

      <div className="flex gap-2 text-xs">
        {/* <span>フォロー: {followingsCount}人</span> */}
        <FollowingsListDrawer userId={id} followingsCount={followingsCount} />
        {/* <span>フォロワー: {followersCount}人</span> */}
        <FollowersListDrawer userId={id} followersCount={followersCount} />
      </div>
    </>
  );
};

export default UserFollowSection;
