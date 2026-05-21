import { User } from "./user";

export type Comment = {
  id: number;
  diary_id: number;
  user_id: number;
  body: string;
  created_at: string;
  updated_at: string;
  parent_id: number | null;
  depth: number;
  path: string;
  root_id: number;
  replies_count: number;
  likes_count: number;
  liked_by_me: boolean;
  user: User;
};
