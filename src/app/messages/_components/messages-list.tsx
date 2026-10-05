import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ConversationListItem } from "@/types/conversation";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const MessagesList = async () => {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }
  const fetchData = await res.json();
  const conversations: ConversationListItem[] = fetchData.conversations;

  return (
    <ul className="divide-y py-4 space-y-4">
      {conversations.length === 0 ? (
        <li>メッセージはありません</li>
      ) : (
        conversations.map((c) => (
          <li
            key={c.id}
            className={`w-full pb-2 ${c.is_unread ? "text-foreground" : "text-foreground/50"}`}
          >
            <Link
              href={`/messages/${c.id}`}
              className="flex gap-2 items-center hover:bg-muted"
            >
              <Avatar>
                <AvatarImage
                  src={
                    c.other_user.icon_path
                      ? `/storage/${c.other_user.icon_path}`
                      : "/images/icon_placeholder.png"
                  }
                  alt={`${c.other_user.name}のアイコン`}
                />
                <AvatarFallback>OG</AvatarFallback>
                {c.is_unread && <AvatarBadge className="bg-rose-600" />}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-xs">
                  <span>{c.other_user.name}</span>
                  {c.last_message_at === null ? (
                    <span>メッセージなし</span>
                  ) : (
                    <span>{dayjs(c.last_message_at).fromNow()}</span>
                  )}
                </div>
                <div className="text-sm truncate">{c.last_message?.body}</div>
              </div>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
};

export default MessagesList;
