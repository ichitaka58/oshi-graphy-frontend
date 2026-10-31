"use client";

import { Button } from "@/components/ui/button";
import { toggleUserFollow } from "../../actions";
import { toast } from "sonner";
import { unstable_rethrow } from "next/navigation";
import { useState } from "react";
import FollowersListDrawer from "./followers-list-drawer";
import FollowingsListDrawer from "./followings-list-drawer";
import { startConversation } from "@/app/messages/actions";

type Props = {
  id: string;
  initialFollowingsCount: number;
  initialFollowersCount: number;
  initialIsFollowing: boolean;
  showFollowButton: boolean;
  isFollowedBy: boolean;
};

const UserFollowSection = ({
  id,
  initialFollowingsCount,
  initialFollowersCount,
  initialIsFollowing,
  showFollowButton,
  isFollowedBy,
}: Props) => {
  const [followingsCount, setFollowingsCount] = useState<number>(
    initialFollowingsCount,
  );
  const [followersCount, setFollowersCount] = useState<number>(
    initialFollowersCount,
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing);
  const [busy, setBusy] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const isMutualFollow: boolean = isFollowing && isFollowedBy; // 相互フォローしているか

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

  // 会話を作成（既にあれば取得）してスレッドへ移動
  const handleStartConversation = async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      const result = await startConversation(Number(id));
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setIsStarting(false);
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
      {isMutualFollow && (
        <Button
          type="button"
          variant="default"
          onClick={handleStartConversation}
          disabled={isStarting}
          className="hover:bg-primary/70"
        >
          メッセージを送る
        </Button>
      )}

      <div className="flex gap-2 text-xs">
        <FollowingsListDrawer userId={id} followingsCount={followingsCount} />
        <FollowersListDrawer userId={id} followersCount={followersCount} />
      </div>
    </>
  );
};

export default UserFollowSection;
