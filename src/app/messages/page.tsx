import { getCurrentUser } from "@/lib/auth";
import MessagesList from "./_components/messages-list";

const MessagesPage = async () => {
  await getCurrentUser();
  return (
    <div className="max-w-xl w-full mx-auto pt-6 px-6">
      <h1 className="text-center mb-4 text-2xl text-foreground font-extrabold">
        メッセージ一覧
      </h1>
      <MessagesList />
    </div>
  );
};

export default MessagesPage;
