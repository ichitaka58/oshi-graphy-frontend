import { Artist } from "./artist";
import { Image } from "./image";

export type Diary = {
  id: number;
  user_id: number;
  artist_id: number;
  happened_on: string;
  body: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type CoverImage = {
  id: number;
  diary_id: number;
  path: string;
  created_at: string;
  updated_at: string;
};

export type DiaryListItem = Diary & {
  comments_count: number;
  likes_count: number;
  liked_by_me: boolean;
  artist: Artist;
  cover_image: CoverImage | null;
};

export type DiaryDetailItem = Diary & {
  comments_count: number;
  likes_count: number;
  liked_by_me: boolean;
  artist: Artist;
  images: Image[];
};

export type DiaryEditItem = Diary & {
  artist: Artist;
  images: Image[];
}