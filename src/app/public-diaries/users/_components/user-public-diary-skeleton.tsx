import DiarySkeleton from "@/components/diary-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const UserPublicDiarySkeleton = () => {
  return (
    <>
      <Skeleton className="h-8 w-72 justify-self-center" />
      <Skeleton className="mb-4 h-5 w-30 justify-self-center" />
      <DiarySkeleton />
    </>
  );
}

export default UserPublicDiarySkeleton;