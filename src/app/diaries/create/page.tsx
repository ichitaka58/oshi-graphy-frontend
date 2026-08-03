import BackButton from "@/components/back-button";
import DiaryCreateForm from "./_components/diary-create-form";
import { getCurrentUser } from "@/lib/auth";

const DiaryCreatePage = async () => {
  await getCurrentUser(); // ログインチェック
  return (
    <div>
      <BackButton />
      <div className="w-75 mx-auto mt-4">
        <DiaryCreateForm />
      </div>
    </div>
  );
};

export default DiaryCreatePage;
