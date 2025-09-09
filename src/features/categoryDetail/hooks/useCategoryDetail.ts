"use client";

import { CategoryData } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useCategoryDetail = (category: CategoryData) => {
  const router = useRouter();

  const handleBackToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleCreateGenre = useCallback(() => {
    // カテゴリ名をURLセーフに変換
    const urlSafeName = encodeURIComponent(category.name);
    router.push(`/dashboard/category/${category.id}/${urlSafeName}/genres/new`);
  }, [router, category.id, category.name]);

  return {
    category,
    handleBackToDashboard,
    handleCreateGenre,
  };
};
