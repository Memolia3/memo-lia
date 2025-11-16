"use server";

import { auth } from "@/auth";
import { createUrl, CreateUrlData, deleteUrl, getUrlsByGenre, UrlData } from "@/lib/db/urls";
import { getTranslations } from "next-intl/server";

export async function createUrlAction(data: Omit<CreateUrlData, "userId">): Promise<UrlData> {
  const t = await getTranslations("errors");
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(t("authRequired"));
  }

  if (!data.genreId) {
    throw new Error(t("genreIdRequired"));
  }

  return await createUrl({
    ...data,
    userId: session.user.id,
  });
}

export async function getUrlsByGenreAction(genreId: string): Promise<UrlData[]> {
  const t = await getTranslations("errors");
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(t("authRequired"));
  }

  if (!genreId) {
    throw new Error(t("genreIdRequired"));
  }

  return await getUrlsByGenre(genreId, session.user.id);
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
