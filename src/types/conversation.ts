import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
  id: number;
  user_one_id: number;
  user_two_id: number;
  last_message_at: string | null;
  user_one_read_at: string | null;
  user_two_read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversationWithUser = Conversation & {
  other_user: User;
};

export type ConversationListItem = ConversationWithUser & {
  is_unread: boolean;
  last_message: Message | null;
};
