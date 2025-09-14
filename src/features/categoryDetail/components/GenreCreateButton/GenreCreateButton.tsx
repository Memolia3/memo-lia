"use client";

import { Button } from "@/components/ui";
import { cn } from "@/utils";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface GenreCreateButtonProps {
  onCreateGenre: () => void;
  className?: string;
}

export const GenreCreateButton: React.FC<GenreCreateButtonProps> = ({
  onCreateGenre,
  className,
}) => {
  const t = useTranslations("categoryDetail");

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onCreateGenre}
      className={cn("flex items-center gap-2", className)}
    >
      <Plus className="w-4 h-4" />
      {t("buttons.createGenre")}
    </Button>
  );
};
