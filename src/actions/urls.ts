"use server";

import { auth } from "@/auth";
import { createUrl, CreateUrlData, deleteUrl, getUrlsByGenre, UrlData } from "@/lib/db/urls";

export async function createUrlAction(data: Omit<CreateUrlData, "userId">): Promise<UrlData> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }

  if (!data.genreId) {
    throw new Error("ジャンルIDが必要です");
  }

  return await createUrl({
    ...data,
    userId: session.user.id,
  });
}

export async function getUrlsByGenreAction(genreId: string): Promise<UrlData[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }

  if (!genreId) {
    throw new Error("ジャンルIDが必要です");
  }

  return await getUrlsByGenre(genreId, session.user.id);
}

export async function deleteUrlAction(urlId: string): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }

  if (!urlId) {
    throw new Error("URLIDが必要です");
  }

  await deleteUrl(urlId, session.user.id);
}
