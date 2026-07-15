import { User } from "./user";

export type LikeResult =
  | { success: true; liked: boolean; count: number }
  | { success: false; message: string };

export type DiaryDetailPath = `/public-diaries/${string}` | `/diaries/${string}`;

export type LikePath = DiaryDetailPath | "/public-diaries" | "/diaries";

export type LikersResult = { success: true; likers: User[] } | { success: false; message: string }