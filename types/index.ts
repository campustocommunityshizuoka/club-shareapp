// types/index.ts
export type Circle = {
  id: string;
  name: string;
  description: string;
  contact_info: string | null; // 追加
  image_path: string | null;
  created_at: string;
};