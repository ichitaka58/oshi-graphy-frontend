import { ActionResult } from "./action-result";
import { User } from "./user";

export type LikeResult = ActionResult<{ liked: boolean; count: number }>;

export type DiaryDetailPath =
  | `/public-diaries/${string}`
  | `/diaries/${string}`;

export type LikePath = DiaryDetailPath | "/public-diaries" | "/diaries";

export type LikersResult = ActionResult<{ likers: User[]; lastPage: number }>;
