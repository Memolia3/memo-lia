"use client";

import { Button } from "@/components/ui";
import { cn } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActionButtonsProps {
  onBackToDashboard: () => void;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onBackToDashboard, className }) => {
  const t = useTranslations("categoryDetail");

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onBackToDashboard}
      className={cn("flex items-center gap-2", className)}
    >
      <ArrowLeft className="w-4 h-4" />
      {t("buttons.backToDashboard")}
    </Button>
  );
};
