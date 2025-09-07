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
    // TODO: ジャンル作成画面への遷移
    console.log("Create genre for category:", category.id);
  }, [category.id]);

  return {
    category,
    handleBackToDashboard,
    handleCreateGenre,
  };
};
