"use client";

import { Button } from "@/components/ui";
import { cn } from "@/utils";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { UrlCreateButtonProps } from "./UrlCreateButton.types";

export const UrlCreateButton: React.FC<UrlCreateButtonProps> = ({ onCreateUrl, className }) => {
  const t = useTranslations("genreDetail");

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onCreateUrl}
      className={cn("flex items-center gap-2", className)}
    >
      <Plus className="w-4 h-4" />
      {t("buttons.createUrl")}
    </Button>
  );
};
