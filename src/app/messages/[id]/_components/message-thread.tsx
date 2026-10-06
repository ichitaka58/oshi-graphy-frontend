import { Message } from "@/types/message";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const MessageThread = ({messages}: {messages: Message[]}) => {
  return (
    <div>message-thread</div>
  )
}

export default MessageThread;