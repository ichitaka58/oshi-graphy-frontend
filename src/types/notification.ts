export type Notification = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    type: "like" | "comment" | "reply" | "follow";
    target?: "diary" | "comment";
    diary_id?: number;
    comment_id?: number;
    actor_user_id: number;
    actor_name: string;
    target_user_id?: number;
    message: string;
  }
  read_at: string | null;
  created_at: string;
  updated_at: string;
}