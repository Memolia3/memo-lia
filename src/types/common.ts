/**
 * 共通型定義
 * アプリケーション全体で使用される基本的な型
 */

// 基本的なID型
export type ID = string;

// 基本的なタイムスタンプ型
export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

// 基本的なページネーション型
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 基本的なAPIレスポンス型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 基本的な検索・フィルター型
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
}

// 基本的な状態型
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 基本的なフォーム型
export interface FormField {
  name: string;
  value: unknown;
  error?: string;
  touched?: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
}
