export type User = {
  id: number;
  name: string;
  icon_path: string | null;
  profile: string | null;
  created_at: string;
  updated_at: string;
  icon_url: string;
};

export type CurrentUser = User & {
  email: string;
  is_admin: boolean;
};

export type UserProfile = User & {
  public_diaries_count: number;
  followings_count: number;
  followers_count: number;
};
