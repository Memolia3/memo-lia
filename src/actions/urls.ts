"use server";

import { auth } from "@/auth";
import { createUrl, CreateUrlData, deleteUrl, getUrlsByGenre, UrlData } from "@/lib/db/urls";
import { getTranslations } from "next-intl/server";

export type CreateUrlResult =
  | { success: true; data: UrlData }
  | { success: false; error: string };

export async function createUrlAction(data: Omit<CreateUrlData, "userId">): Promise<CreateUrlResult> {
  const t = await getTranslations("errors");
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: t("authRequired") };
  }

  if (!data.genreId) {
    return { success: false, error: t("genreIdRequired") };
  }

  try {
    const result = await createUrl({
      ...data,
      userId: session.user.id,
    });
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : t("unknownError"),
    };
  }
}

export async function getUrlsByGenreAction(
  genreId: string,
  page: number = 1,
  limit: number = 20
): Promise<UrlData[]> {
  const t = await getTranslations("errors");
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(t("authRequired"));
  }

  if (!genreId) {
    throw new Error(t("genreIdRequired"));
  }

  const offset = (page - 1) * limit;
  return await getUrlsByGenre(genreId, session.user.id, offset, limit);
}

export async function deleteUrlAction(urlId: string): Promise<void> {
  const t = await getTranslations("errors");
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(t("authRequired"));
  }

  if (!urlId) {
    throw new Error(t("urlIdRequired"));
  }

  await deleteUrl(urlId, session.user.id);
}
