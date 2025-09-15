"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardActionsProps {
  className?: string;
}

export const DashboardActions: React.FC<DashboardActionsProps> = () => {
  const tForm = useTranslations("categoryForm");
  const tBookmarklet = useTranslations("bookmarklet");
  const router = useRouter();

  return (
    <div className={"flex gap-3 mb-6"} style={{ justifyContent: "flex-end" }}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push("/bookmarklet")}
        className="flex items-center gap-2"
      >
        <Icon name="settings" size="sm" color="accent" />
        {tBookmarklet("title")}
      </Button>
      <Link href="/dashboard/categories/new">
        <Button variant="primary" size="sm">
          + {tForm("buttons.create")}
        </Button>
      </Link>
    </div>
  );
};
