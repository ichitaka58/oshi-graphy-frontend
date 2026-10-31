import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationWithUser } from "@/types/conversation";
import { Message } from "@/types/message";
import { MoveLeft } from "lucide-react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import MessageThread from "./_components/message-thread";
import MessageForm from "./_components/message-form";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import MarkAsRead from "./_components/mark-as-read";
import BackButton from "@/components/back-button";

const ConversationDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const currentUser = await getCurrentUser();
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/conversations/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 403 || res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }
  const fetchData = await res.json();
  const conversation: ConversationWithUser = fetchData.conversation;
  const messages: Message[] = fetchData.messages.data;
  const lastPage: number = fetchData.messages.last_page;

  return (
    <div className="flex flex-col flex-1">
      <BackButton />
      <div className="max-w-xl w-full mx-auto px-6 flex flex-col flex-1">
        <div className="flex items-center gap-1 py-2">
          <Link href="/messages" aria-label="メッセージ一覧に戻る">
            <MoveLeft />
          </Link>
          <Avatar>
            <AvatarImage
              src={
                conversation.other_user.icon_path
                  ? `/storage/${conversation.other_user.icon_path}`
                  : "/images/icon_placeholder.png"
              }
              alt={`${conversation.other_user.name}のアイコン`}
            />
            <AvatarFallback>OG</AvatarFallback>
          </Avatar>
          <span className="text-sm">{conversation.other_user.name}</span>
        </div>
        {/* メッセージ一覧のコンポーネント */}
        <MessageThread
          latestMessages={messages}
          currentUserId={currentUser.id}
          conversationId={conversation.id}
          lastPage={lastPage}
        />
        {/* 画面には何も表示せず、スレッドを既読にするためだけのコンポーネント */}
        <MarkAsRead id={conversation.id} lastMessageId={messages[0]?.id} />
        <MessageForm id={conversation.id} />
      </div>
    </div>
  );
};

export default ConversationDetailPage;
