import BackButton from "@/components/back-button";
import UserProfileEditForm from "./_components/user-profile-edit-form";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

const UserProfileEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if(Number(id) !== user.id) {
    notFound();
  }
  return (
    <div>
      <div className="text-muted-foreground py-3 flex items-center text-sm">
        <BackButton />
      </div>
      <div className="w-75 mx-auto mt-4">
        <UserProfileEditForm id={id} user={user} />
      </div>
    </div>
  );
};

export default UserProfileEditPage;
