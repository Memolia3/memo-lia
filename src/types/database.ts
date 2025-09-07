/**
 * データベース関連の型定義
 * データベースのテーブル構造に対応する型
 */

// import type { Timestamp } from "./common"; // 現在未使用

// ユーザー関連
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProvider {
  id: string;
  user_id: string;
  provider: string;
  provider_id: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// URL関連
export interface Url {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description?: string;
  favicon_url?: string;
  is_active: boolean;
  visit_count: number;
  created_at: Date;
  updated_at: Date;
}

// カテゴリ関連
export interface Category {
  id: string;
  user_id: string;
  parent_id?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order: number;
  level: number;
  path?: string;
  is_active: boolean;
  is_folder: boolean;
  created_at: Date;
  updated_at: Date;
}

// ジャンル関連
export interface Genre {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// タグ関連
export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  description?: string;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

// 関連テーブル
export interface UrlCategory {
  id: string;
  url_id: string;
  category_id: string;
  created_at: Date;
}

export interface UrlTag {
  id: string;
  url_id: string;
  tag_id: string;
  created_at: Date;
}

// ビュー関連（データベースビューに対応）
export interface UrlDetails {
  url_id: string;
  url_title: string;
  url_url: string;
  url_description?: string;
  url_favicon_url?: string;
  url_visit_count: number;
  category_id?: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  genre_id?: string;
  genre_name?: string;
  genre_color?: string;
  genre_icon?: string;
  tags?: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  created_at: Date;
  updated_at: Date;
}

export interface UserStats {
  user_id: string;
  total_urls: number;
  total_categories: number;
  total_genres: number;
  total_tags: number;
  total_visits: number;
  last_activity: Date;
}

export interface PopularUrls {
  url_id: string;
  url_title: string;
  url_url: string;
  visit_count: number;
  user_count: number;
  created_at: Date;
}
