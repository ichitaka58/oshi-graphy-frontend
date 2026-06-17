export type User = {
  id: number;
  name: string;
  email: string;
  icon_path: string | null;
  profile: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  icon_url: string;
};

export type UserProfile = User & {
  public_diaries_count: number;
};
