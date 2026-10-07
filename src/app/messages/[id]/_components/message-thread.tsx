import { Message } from "@/types/message";
import { DateFormatForUpdatedAt } from "@/lib/date";

const MessageThread = ({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: number;
}) => {
  const sortedMessages = messages.toReversed();
  return (
    <div className="bg-secondary p-4 rounded flex-1">
      <ul className="space-y-2">
        {sortedMessages.length === 0 ? (
          <li>メッセージがありません</li>
        ) : (
          sortedMessages.map((m) => (
            <li
              key={m.id}
              className={`flex items-center ${currentUserId === m.sender_id ? "justify-end" : "justify-start"}`}
            >
              <div className="w-1/2">
                <span className="sr-only">
                  {currentUserId === m.sender_id ? "あなた" : "相手"}
                </span>
                <p className="p-2 bg-card text-xs rounded-lg whitespace-pre-wrap wrap-break-word">
                  {m.body}
                </p>
                <p className="text-[11px] text-right">
                  {DateFormatForUpdatedAt(m.created_at)}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MessageThread;
